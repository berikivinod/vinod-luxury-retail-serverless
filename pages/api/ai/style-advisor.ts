import type {
    NextApiRequest,
    NextApiResponse,
} from "next";

import {
    StyleAdvisorRequest,
    StyleAdvisorResponse,
} from "@/types/ai";

import {
    askStyleAdvisor,
} from "@/services/ai/styleAdvisor";

export default async function handler(

    req: NextApiRequest,

    res: NextApiResponse<StyleAdvisorResponse>

) {

    if (req.method !== "POST") {

        return res
            .status(405)
            .end();

    }

    try {

        const body =
            req.body as StyleAdvisorRequest;

        /*
         * Make sure we have messages.
         */

        if (
            !body.messages ||
            body.messages.length === 0
        ) {

            return res.status(400).json({

                reply:
                    "Please provide a message.",

                recommendations: [],

            });

        }

        /*
         * Get the latest user message.
         */

        const lastMessage =
            [...body.messages]
                .reverse()
                .find(
                    (message) =>
                        message.role === "user"
                );

        if (!lastMessage) {

            return res.status(400).json({

                reply:
                    "Please provide a message.",

                recommendations: [],

            });

        }

        /*
         * Build context from ALL user messages.
         *
         * Example:
         *
         * I need shoes.
         * They are for an interview.
         * My budget is $900.
         */

        const conversationContext =
            body.messages

                .filter(
                    (message) =>
                        message.role === "user"
                )

                .map(
                    (message) =>
                        message.content
                )

                .join("\n");

        /*
         * Send the latest message,
         * previous OpenAI response ID,
         * and complete user context.
         */

        const result =
            await askStyleAdvisor(

                lastMessage.content,

                body.previousResponseId,

                conversationContext

            );

        /*
         * Return the actual AI response
         * and recommendations.
         */

        return res.status(200).json({

            reply:
                result.reply,

            responseId:
                result.responseId,

            recommendations:
                result.recommendations,

        });

    } catch (error) {

        console.error(
            "Style Advisor Error:",
            error
        );

        return res.status(500).json({

            reply:
                "Sorry, I'm having trouble connecting to the AI service right now.",

            recommendations: [],

        });

    }

}