import { useState } from "react";

import styles from "@/styles/ChatInput.module.css";

interface Props {

    loading: boolean;

    onSend: (
        message: string
    ) => void;

}

export default function ChatInput({

    loading,

    onSend,

}: Props) {

    const [text, setText] =
        useState("");

    function submit() {

        if (!text.trim()) {
            return;
        }

        onSend(text);

        setText("");

    }

    return (

        <div className={styles.container}>

            <input

                value={text}

                placeholder="Ask your Style Advisor..."

                onChange={(e) =>
                    setText(
                        e.target.value
                    )
                }

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        submit();

                    }

                }}

            />

            <button

                disabled={loading}

                onClick={submit}

            >

                {loading
                    ? "..."
                    : "Send"}

            </button>

        </div>

    );

}