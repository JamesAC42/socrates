import { useContext, useState, useEffect } from "react";
import styles from "../../styles/page.module.scss";
import NavBar from "@/components/NavBar";
import UserContext from "@/contexts/UserContext";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import postFetch from "@/lib/postFetch";
import getFetch from "@/lib/getFetch";
import Head from "next/head";

export default function Home() {
    
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);

    const [loadingConversation, setLoadingConversation] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingEval, setIsLoadingEval] = useState(false);
    const [evaluation, setEval] = useState(null);

    const [topic, setTopic] = useState("");
    const [thesis, setThesis] = useState("");
    const [loadingBegin, setLoadingBegin] = useState(false);

    const [activeTopic, setActiveTopic] = useState("");
    const [activeThesis, setActiveThesis] = useState("");

    const {userInfo, setUserInfo} = useContext(UserContext);

    useEffect(() => {
        const fetchConversation = async () => {
            if (loadingConversation && !conversation.length) {

                let messages;
                const response = await getFetch("/socrates/api/getConversation", {});
                setLoadingConversation(false);
                if (response.success) {
                    
                    messages = response.conversation;
                    if(messages.length === 0) {
                        setConversation([]);
                        return;
                    }

                    const convoInfo = getTopicAndThesis(messages[0]);
                    setActiveTopic(convoInfo.topic);
                    setActiveTopic(convoInfo.thesis);
                    
                    messages.splice(0,1);
                    messages = messages.map((m) => {
                        if(m.role === "user") {
                            return cleanMessageUser(m); 
                        } else {
                            return cleanMessageAssistant(m);
                        }
                    });
                    setConversation(messages);

                } else {
                    console.error(response.message);
                    return;
                }
            }
        };
        fetchConversation();
    }, [loadingConversation, conversation.length]);

    const disableLength = () => {
        if(!userInfo) return true;
        if(userInfo.tier === 1) {
            return conversation.length >= 29;
        } else {
            return conversation.length >= 59;
        }
    }

    const getTopicAndThesis = (message) => {

        const regexTopic = /<expert_field>([\s\S]*?)<\/expert_field>/;
        const regexThesis = /<initial_statement>([\s\S]*?)<\/initial_statement>/;

        const topicMatch = message.content[0].text.match(regexTopic);
        const thesisMatch = message.content[0].text.match(regexThesis);

        let topic = topicMatch ? topicMatch[1].trim() : "";
        let thesis = thesisMatch ? thesisMatch[1].trim() : topic;
        thesis = thesis ? thesis : topic;

        return {
            topic, 
            thesis
        }
        
    }

    const cleanMessage = (message, regex) => {

        const match = message.content[0].text.match(regex);
        const cleanedText = match ? match[1].trim() : "";
        if(!cleanedText) {
            throw new Error("Message format invalid");   
        }
        return {
            ...message,
            content: [
                {
                    type:'text',
                    text: cleanedText
                }
            ]
        }
    }

    const cleanMessageAssistant = (message) => {
        const regex = /<layperson_response>([\s\S]*?)<\/layperson_response>/;
        return cleanMessage(message, regex);
    }

    const cleanMessageUser = (message) => {
        const regex = /<expert_response>([\s\S]*?)<\/expert_response>/;
        return cleanMessage(message, regex);
    }

    const scrollToBottom = () => {
        const conversationElement = document.querySelector(`.${styles.conversation}`);
        if (conversationElement) {
            conversationElement.scrollTop = conversationElement.scrollHeight;
        }
    };

    const startConversation = async () => {

        if(loadingBegin) return;
        if(!userInfo?.id) return;
        if(!topic.trim()) return;

        try {

            setLoadingBegin(true);
            const response = await postFetch("/socrates/api/startConversation", {topic, thesis});
            setLoadingBegin(false); 
            if(response.success) {
                const messages = response.conversation;
                const convoInfo = getTopicAndThesis(messages[0]);
                setActiveTopic(convoInfo.topic);
                setActiveThesis(convoInfo.thesis);
                messages.splice(0, 1);
                messages[0] = cleanMessageAssistant(response.conversation[0]);
                setConversation(messages);
                setTopic("");
                setThesis("");
            }

        } catch(err) {
            setLoadingBegin(false);
            console.error(err);
        } 

    }

    const restartConversation = async () => {
        if(!window.confirm("Are you sure you want to restart the conversation? You will lose the current one.")) return;

        try {
            const response = await postFetch("/socrates/api/restartConversation", {});
            if(response.success) {
                setConversation([]);
                setActiveThesis("");
                setActiveTopic("");
            }
        } catch(err) {
            console.error(err);
        }
    }

    const sendMessage = async () => {

        if(!userInfo?.id) return;
        if(message.trim().length === 0) return;
        if(disableLength()) return;
        if(isLoading) return;

        try {
            const updatedConversation = [
                ...conversation,
                { role: 'user', content: [{ type: 'text', text: message }] }
            ];
            setConversation(updatedConversation);
            setMessage('');
            setIsLoading(true);
            
            // Scroll to bottom after user message is added
            setTimeout(scrollToBottom, 0);
            const data = await postFetch("/socrates/api/sendMessage", { message })
            setIsLoading(false);
            
            if(data.success) {
                const newConversation = [
                    ...updatedConversation,
                    cleanMessageAssistant(data.message)
                ];
                setConversation(newConversation);
                
                // Scroll to bottom after bot message is added
                setTimeout(scrollToBottom, 0);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error sending message:', error);
        }
    };

    const evaluateConversation = async () => {

        if(!userInfo?.id) return;
        if(isLoadingEval) return;
        if(isLoading) return;
        setIsLoadingEval(true);
        const response = await fetch('/socrates/api/evaluate', {
            method: 'POST'
        });
        const data = await response.json();
        setIsLoadingEval(false);
        if(data.success) {
            setEval(data.evaluation);
        } else {
            alert(data.message);
        }
        
    }

    const renderEval = () => {

        if(!evaluation) return null;
        return(
            <>
            <div className={styles.evalBackground} onClick={() => setEval(null)}></div>
            <div className={styles.evalOuter}>
                <div className={styles.evalInner}>
                <div className={styles.evalConfidence}>Expert Confidence Score: <span className={styles.score}>{evaluation.expert_confidence_score} / 10</span></div>
                <div className={styles.justification}>{evaluation.score_justification}</div>
                <div className={styles.topicsHeader}>Areas of concern:</div>
                {
                    evaluation.weak_points.map(p => (
                        <div className={styles.weakPoint}>
                            <div className={styles.weakPointHeader}>{p.issue}</div>
                            <div className={styles.topicsLabel}>You may want to look into:</div>
                            <div className={styles.weakPointTopics}>
                                {
                                    p.research_topics.map((t) => (
                                        <div className={styles.topic}>
                                            {t}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                <div className={styles.closeEval} onClick={() => setEval(null)}>Close</div>
                </div>
            </div>
            </>
        )

    }

    const renderStartConversation = () => {
        return(
            <div className={styles.startConversation}>

                <h2>To get started,</h2>
                <p>type a topic you'd like to quiz yourself on.</p>

                <div className={styles.examples}>
                    Examples: Ancient Egyptian Mythology, Quantum Physics, 1980s Pop Culture, Culinary Techniques, Bonsai Tree Cultivation
                </div>

                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic..." maxLength={200} type="text" className={styles.topicInput}/>

                <h3>Optionally,</h3>
                <p>briefly describe your position or thesis that you will be asked to defend.</p>

                <div className={styles.examples}>
                    Examples:
                    <ul>
                        <li>"The potential applications of quantum entanglement in secure communication"</li>
                        <li>"The impact of MTV on shaping music trends in the 1980s"</li>
                        <li>"The role of pruning techniques in expressing artistic vision in bonsai cultivation"</li>
                    </ul>
                </div>

                <input value={thesis} onChange={(e) => setThesis(e.target.value)} placeholder="Thesis (Optional)..." maxLength={200} type="text" className={styles.thesisInput}/>

                <div className={styles.startConversationButton}>
                    <div
                        onClick={() => startConversation()} 
                        className={`${styles.begin} ${loadingBegin ? styles.disabled : ""}`}>
                            {loadingBegin ? "Starting..." : "Begin"}</div>
                </div>
                
                <h3>tips:</h3>
                <ol>
                    <li>Answer the questions as thoroughly as you can. Try to demonstrate the depth of your knowledge on the subject.</li>
                    <li>You don't have to answer every question, but not doing so will be reflected in your analysis.</li>
                    <li>After you've sent <strong>3 messages</strong>, you will be able to evaluate how the conversation went and see an analysis of your expertise.</li>
                    <li>It is recommended to continue until you no longer can comfortably answer any questions, and then evaluate.</li>
                    <li>You can continue the conversation after evaluating, and evaluate again, or restart for a new conversation at any time.</li>
                    <li>Free accounts are limited to sending 15 messages per conversation and 5 evaluations. <Link href="/pricing">See the pricing info here to upgrade and get longer conversations and unlimited evaluations.</Link></li>
                </ol>

            </div>
        )
    }

    const renderActiveConversation = () => {

        return(
            <>
            <div className={styles.convoInfo}>
                <div className={styles.topic}>Topic: {activeTopic}</div>
                <div className={styles.thesis}>Thesis: {activeThesis}</div>
                <div className={styles.messageCount}>Turns: {Math.ceil(conversation.length / 2)}</div>
            </div>
            <div className={styles.conversation}>
                {
                conversation.map((item, index) => (
                    <div className={styles.conversationItem} key={index}>
                        <strong>{item.role}:</strong> {item.content[0].text}
                    </div>
                    ))
                }
                {   
                    isLoading ? (
                    <div className={styles.conversationItem}>
                        <div className={styles.placeholder}></div>
                        <div className={styles.placeholder}></div>
                        <div className={styles.placeholder}></div>
                    </div>
                    ) : null
                }
            </div>
            <div className={styles.inputOuter}>
                <textarea
                    type="text"
                    className={styles.messageInput}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                    placeholder="Type message..."
                    value={message}
                    maxLength={2000}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <div className={styles.buttons}>
                <button className={`${styles.send} ${disableLength() || message.length === 0 ? styles.disabled : ""}`} onClick={sendMessage}>
                    {disableLength() ? "Limit Reached" : "Send"}
                </button>
                {
                    conversation.length > 5 ?
                    <button
                        disabled={isLoadingEval || isLoading} 
                        className={`${styles.evaluate} ${
                            isLoadingEval || isLoading ? styles.disabled : ""
                        } ${isLoadingEval ? styles.loadingAnimation : ""}`} 
                        onClick={evaluateConversation}>
                        {
                            isLoadingEval ?
                            "Loading..." : "Evaluate Me"
                        }
                    </button> : null
                }
                <button className={styles.restart} onClick={restartConversation}>Restart</button>
            </div>
            </>
        )

    }

    return (
        <div className={styles.mainContent}>

            <Head>
                <title>socrates - chat</title>
            </Head>

            <NavBar />

            {
                evaluation &&
                    renderEval()
            }
            
            <div className={styles.contentBackground}></div>
            <div className={styles.contentInner}>

                {
                    userInfo?.id ?
                    <>
                        {
                            conversation.length === 0 && !loadingConversation ?
                            renderStartConversation()
                            :
                            renderActiveConversation()
                        }
                    </>
                    :
                    <div className={styles.signin}>
                        <div className={styles.signinHeader}>
                            <h2>Sign in or make an account to start!</h2>
                        </div>
                        <div className={styles.buttons}>
                            <Link href="/signin">
                            <div className={`${styles.signinButton} ${styles.getStarted}`}>
                                Get started for free <FaArrowAltCircleRight />
                            </div>
                            </Link>
                            <Link href="/">
                            <div className={`${styles.signinButton} ${styles.learnMore}`}>
                                Learn more <FaArrowAltCircleRight />
                            </div>
                            </Link>
                        </div>
                    </div>
                }
                

            </div>
        </div>
    )

}
