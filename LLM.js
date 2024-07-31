const Anthropic = require("@anthropic-ai/sdk");
const {key} =  require("./anthropic_key.json");
const prompts = require("./prompts.js");

class LLM {

    constructor(redisClient) {
        this.redisClient = redisClient;
        this.anthropic = new Anthropic({apiKey: key});
    }

    async conversationAddMessage(userToken, conversationToken, message) {
           
        const conversationKey = `socrates:${userToken}:${conversationToken}`;
        
        let conversation = await this.getConversation(conversationKey);
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

    async getConversation(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.lrange(key, 0, -1, (error, result) => {
                if(error) {
                    reject(error);     
                } else {
                    if(result) {
                        console.log(result);
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
                temperature: 0.6,
                system: "You are going to act as a curious layperson having a conversation with a domain expert. Your goal is to ask questions, seek clarifications, and request follow-ups to fully engage the conversation partner and encourage them to reveal the breadth of their knowledge and understanding.",
                messages: conversation
            });
            return this.messageItem(msg.role, msg.content[0].text);
        } catch(err) {
            console.error(err);
            throw err;
        }

    }
}

module.exports = LLM;