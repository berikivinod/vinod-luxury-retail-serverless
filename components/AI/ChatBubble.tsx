import { ChatMessage } from "@/types/ai";

import styles from "@/styles/ChatBubble.module.css";

interface Props {

    message: ChatMessage;

}

export default function ChatBubble({

    message,

}: Props) {

    const isUser =
        message.role === "user";

    return (

        <div
            className={
                isUser
                    ? styles.userContainer
                    : styles.assistantContainer
            }
        >

            {

                !isUser && (

                    <div className={styles.avatar}>

                        👩

                    </div>

                )

            }

            <div>

                {

                    !isUser && (

                        <div className={styles.name}>

                            AI Style Advisor

                        </div>

                    )

                }

                <div
                    className={
                        isUser
                            ? styles.user
                            : styles.assistant
                    }
                >

                    {message.content}

                </div>

            </div>

        </div>

    );

}