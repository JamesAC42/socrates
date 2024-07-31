import { useState } from "react";
import styles from "../styles/page.module.scss";
export default function Home() {
    
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    try {
        setIsLoading(true);
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        setIsLoading(false);
        
        if(data.success) {
            setConversation([
                ...conversation,
                { role: 'user', content: [{ type: 'text', text: message }] },
                data.message
            ]);
            setMessage('');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
  };

  console.log(conversation);

  return (
    <div className={styles.mainContent}>
      <input
        type="text"
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={styles.send} onClick={sendMessage}>Send</button>
      <div className={styles.conversation}>
        {conversation.map((item, index) => (
          <div className={styles.conversationItem} key={index}>
            <strong>{item.role}:</strong> {item.content[0].text}
          </div>
        ))}
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
    </div>
  )

}