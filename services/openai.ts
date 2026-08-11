import OpenAI from "openai";

import {
    ChatMessage,
} from "@/types/ai";

const client = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY,

});

export async function askStyleAdvisor(
    messages: ChatMessage[]
): Promise<string> {

    const conversation = [

        {

            role: "system" as const,

            content: [

                {

                    type: "input_text" as const,

                    text:
                        "You are the AI Style Advisor for Vinod Luxury Retailers. You help customers discover luxury fashion products and provide personalized styling advice. Ask follow-up questions whenever more information is needed. Keep responses professional, friendly, concise, and conversational."

                }

            ]

        },

        ...messages.map((message) => ({

            role: message.role,

            content: [

                {

                    type: "input_text" as const,

                    text: message.content,

                }

            ]

        }))

    ];

    const response =
        await client.responses.create({

            model: "gpt-5",

            input: conversation,

        });

    return response.output_text;

}