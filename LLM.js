const Anthropic = require("@anthropic-ai/sdk");
const {key} =  require("./anthropic_key.json");
const prompts = require("./prompts.js");
const { v4 } = require('uuid');

class LLM {

    constructor(redisClient) {
        this.redisClient = redisClient;
        this.anthropic = new Anthropic({apiKey: key});
    }

    getConversationKey(userToken, conversationToken) {
        return `socrates:${userToken}:${conversationToken}`;
    }

    async startConversation(userToken, topic, thesis) {

        let convoId = await this.getUserConversationKey(userToken);
        const conversationKey = this.getConversationKey(userToken, convoId);
        let conversation = [];

        if(thesis === "") {
            thesis = topic;
        }
        let messageText = prompts.startConversation(topic,thesis);
        let messageItem = this.messageItem("user", messageText);
        conversation.push(messageItem);

        let attempts = 0;
        let success = false;
        let response;
        while(attempts++ < 5) {
            response = await this.promptConversation(conversation);
            if (response && response.content && response.content[0] && response.content[0].text) {
                const responseText = response.content[0].text.trim();
                if (responseText.startsWith('<layperson_response>') && responseText.endsWith('</layperson_response>')) {
                    success = true;
                    break;                    
                }
            }
        }

        if(!success) {
            throw new Error("Could not generate valid response.");
        }

        await this.saveMessage(conversationKey, response);
        conversation.push(response);
        return conversation;

    }

    async conversationAddMessage(userToken, message, premium) {
           
        let convoId = await this.getUserConversationKey(userToken);
        const conversationKey = this.getConversationKey(userToken, convoId);
        let conversation = await this.getConversation(conversationKey);

        if(conversation.length >= 30) {
            throw new Error("Conversation has reached max length.");
        }

        let userText = this.encodeUserMessage(message);
        let messageItem = this.messageItem("user", userText);
        if(conversation.length === 0) {
            messageItem.content[0].text =
                prompts.startConversation(message, message);
            conversation = [messageItem];
        } else {
            conversation.push(messageItem);
        }
        await this.saveMessage(conversationKey, messageItem);

        const response = await this.promptConversation(conversation);
        
        conversation.push(response);
        await this.saveMessage(conversationKey, response);
        
        return response;

    }

    validateEvaluation(evaluation) {

        if (typeof evaluation !== 'object' || evaluation === null) {
            return false;
        }

        // Validate expert_confidence_score
        if (!Number.isInteger(evaluation.expert_confidence_score) || 
            evaluation.expert_confidence_score < 1 || 
            evaluation.expert_confidence_score > 10) {
            return false;
        }

        // Validate score_justification
        if (typeof evaluation.score_justification !== 'string' || 
            evaluation.score_justification.trim() === '') {
            return false;
        }

        // Validate weak_points
        if (!Array.isArray(evaluation.weak_points)) {
            return false;
        }

        for (const point of evaluation.weak_points) {
            if (typeof point !== 'object' || point === null) {
                return false;
            }

            if (typeof point.issue !== 'string' || point.issue.trim() === '') {
                return false;
            }

            if (!Array.isArray(point.research_topics)) {
                return false;
            }

            for (const topic of point.research_topics) {
                if (typeof topic !== 'string' || topic.trim() === '') {
                    return false;
                }
            }
        }

        return true;

    }

    async evaluateConversation(userToken) {

        let convoId = await this.getUserConversationKey(userToken);
        const conversationKey = this.getConversationKey(userToken, convoId);
        let conversation = await this.getConversation(conversationKey);

        let attempts = 0;
        while(attempts++ < 5) {
            let evaluation = await this.promptEvaluation(conversation);

            const outputRegex = /<output>([\s\S]*?)<\/output>/;
            const match = evaluation.match(outputRegex);
            
            try {
                if (match && match[1]) {
                    evaluation = match[1].trim();
                } else {
                    throw new Error("No <output> tags found in the evaluation");
                }
    
                evaluation = JSON.parse(evaluation);
                if(this.validateEvaluation(evaluation)) {
                    return evaluation;
                } else {
                    throw new Error("Invalid output schema generated.");
                }

            } catch(err) {
                console.error(err);
                continue;
            }
        }

        throw new Error("Unable to create valid evaluation output.");

    }

    async getUserConversationKey(userToken) {

        return new Promise((resolve, reject) => {
            this.redisClient.keys(`socrates:${userToken}:*`, (err, result) => {
                if(err) {
                    reject(err);
                    return;
                }
                if(result.length > 0) {
                    let filtered = result.map(k => {
                        return k.split(':')[2];
                    });
                    resolve(filtered[0]);
                } else {
                    resolve(v4());
                }
            });
        });

    }

    async getUserConversation(userToken) {

        let convoId = await this.getUserConversationKey(userToken);
        let conversationKey = this.getConversationKey(userToken, convoId);
        let conversation = await this.getConversation(conversationKey);

        return conversation;

    }

    async restartUserConversation(userToken) {

        let convoId = await this.getUserConversationKey(userToken);
        let conversationKey = this.getConversationKey(userToken, convoId);
        try {
            await this.deleteConversation(conversationKey);
            return true;
        } catch (error) {
            console.error("Error deleting conversation:", error);
            return false;
        }

    }

    async getConversation(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.lrange(key, 0, -1, (error, result) => {
                if(error) {
                    reject(error);     
                } else {
                    if(result) {
                        resolve(result.map(JSON.parse));
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    }

    async saveMessage(key, message) {
        return new Promise((resolve, reject) => {
            this.redisClient.rpush(key, JSON.stringify(message), (error) => {
                if(error) {
                    reject(error);     
                } else {
                    resolve();
                }
            });
        });
    }

    async deleteConversation(key) {
        await this.redisClient.del(key);
    }

    messageItem(role,message) {
        return {
            "role":role,
            "content": [{
                "type":"text",
                "text": message
            }]
        }
    }

    extractLaypersonResponse(text) {
        const regex = /<layperson_response>([\s\S]*?)<\/layperson_response>/;
        const match = text.match(regex);
        if (match) {
            text = match[1].trim();
            return text;
        } else {
            throw new Error("Invalid response format");
        }
    }

    encodeUserMessage(text) {
        return "<expert_response>" + text + "</expert_response>";
    }

    async promptConversation(conversation) {
        
        try {
            const msg = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1000,
                temperature: 0.7,
                system: "You are going to act as a curious layperson having a conversation with a domain expert. Your goal is to ask questions, seek clarifications, and request follow-ups to fully engage the conversation partner and encourage them to reveal the breadth of their knowledge and understanding.",
                messages: conversation
            });
            return this.messageItem(msg.role, msg.content[0].text);
        } catch(err) {
            console.error(err);
            throw err;
        }

    }

    formatMessageForEvaluation(message) {

        let role = message.role;
        let text = message.content[0].text;

        let formattedMessage = "";
        // Check for XML tags in the text if the role is "user"
        if (role === "user") {
            const expertFieldRegex = /<expert_field>([\s\S]*?)<\/expert_field>/;
            const match = text.match(expertFieldRegex);
            if (match) {
                formattedMessage += "<expert_field>" + match[1] + "</expert_field>\n";
                const initialStatement = /<initial_statement>([\s\S]*?)<\/initial_statement>/;
                const statementMatch = text.match(initialStatement);
                formattedMessage += "<initial_statement>" + statementMatch[1] + "</initial_statement>\n";
            } else {
                formattedMessage += text + "\n";
            }
        } else {
            formattedMessage += text + "\n";
        }

        return formattedMessage;

    }

    async promptEvaluation(conversation) {

        let conversationLog = "";
        for(let i = 0; i < conversation.length; i++) {
            conversationLog += this.formatMessageForEvaluation(conversation[i]);
        }
        try {

            const messageText = prompts.evaluateConversation(conversationLog);
            const msg = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1000,
                temperature: 0.7,
                system: "You are a top domain expert with perfect recall in every subject in existence. Your task is to evaluate a conversation between a person and an AI chatbot, focusing on the person's responses. You will analyze the conversation to identify any weak points in the person's knowledge of the domain.",
                messages: [this.messageItem("user", messageText)]
            });
            return msg.content[0].text;
        }catch(err) {
            console.error(err);
            throw err;
        }

    }
}

module.exports = LLM;