import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

import useAIChat from "@/hooks/useAIChat";

import styles from "@/styles/AIChat.module.css";

export default function AIChat() {

    const {
        messages,
        loading,
        send,
    } = useAIChat();

    const messagesRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (messagesRef.current) {

            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;

        }

    }, [messages, loading]);

    return (

        <div className={styles.chat}>

            <div
                ref={messagesRef}
                className={styles.messages}
            >

                {messages.map((message) => (

                    <ChatBubble
                        key={message.id}
                        message={message}
                    />

                ))}

                {loading && (

                    <div className={styles.typingContainer}>

                        <div className={styles.avatar}>
                            👩
                        </div>

                        <div>

                            <div className={styles.name}>
                                AI Style Advisor
                            </div>

                            <div className={styles.typingBubble}>

                                <span>.</span>
                                <span>.</span>
                                <span>.</span>

                            </div>

                        </div>

                    </div>

                )}

            </div>

            <ChatInput
                loading={loading}
                onSend={send}
            />

        </div>

    );

}