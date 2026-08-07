import { useState } from "react";

import {
    ChatMessage,
} from "@/types/ai";

import {
    sendMessage,
} from "@/services/ai";

export default function useAIChat() {

    const [messages, setMessages] =
        useState<ChatMessage[]>([
            {
                id: "welcome",

                role: "assistant",

                content:
                    "Welcome to Vinod Luxury Retailers. I'm your AI Style Advisor. Tell me what you're shopping for today.",

                createdAt:
                    new Date().toISOString(),
            },
        ]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function send(
        text: string
    ) {

        if (!text.trim()) {
            return;
        }

        setError(null);

        const userMessage: ChatMessage = {

            id: `${Date.now()}-user`,

            role: "user",

            content: text,

            createdAt:
                new Date().toISOString(),

        };

        const updatedMessages = [
            ...messages,
            userMessage,
        ];

        setMessages(updatedMessages);

        try {

            setLoading(true);

            const response =
                await sendMessage({

                    messages:
                        updatedMessages,

                });

            const assistantMessage: ChatMessage = {

                id: `${Date.now()}-assistant`,

                role: "assistant",

                content:
                    response.reply,

                createdAt:
                    new Date().toISOString(),

            };

            setMessages(previous => [

                ...previous,

                assistantMessage,

            ]);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to contact AI Style Advisor."
            );

        } finally {

            setLoading(false);

        }

    }

    return {

        messages,

        loading,

        error,

        send,

    };

}