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
         * ----------------------------------------
         * Previously shown products
         * ----------------------------------------
         *
         * Assistant messages contain the
         * recommendations that were already
         * displayed to the customer.
         *
         * We collect those product IDs so the
         * Style Advisor can exclude them when
         * the customer asks for another option
         * or more products.
         */

        const previouslyShownProductIds =
            body.messages

                .filter(
                    (message) =>
                        message.role === "assistant"
                )

                .flatMap(
                    (message) =>
                        message.recommendations || []
                )

                .map(
                    (recommendation) =>
                        recommendation.productId
                );


        /*
         * Remove duplicate product IDs.
         */

        const uniquePreviouslyShownProductIds =
            [
                ...new Set(
                    previouslyShownProductIds
                ),
            ];


        console.log(
            "Previously Shown Product IDs:",
            uniquePreviouslyShownProductIds
        );


        /*
         * ----------------------------------------
         * Ask Style Advisor
         * ----------------------------------------
         *
         * Send:
         *
         * 1. Latest customer message
         * 2. Previous OpenAI response ID
         * 3. Complete user conversation
         * 4. Current preferences
         * 5. Previously shown product IDs
         */

        const result =
            await askStyleAdvisor(

                lastMessage.content,

                body.previousResponseId,

                conversationContext,

                body.preferences,

                uniquePreviouslyShownProductIds

            );


        /*
         * ----------------------------------------
         * Return the actual AI response
         * ----------------------------------------
         */

        return res.status(200).json({

            reply:
                result.reply,

            responseId:
                result.responseId,

            recommendations:
                result.recommendations,

            preferences:
                result.preferences,

            intent:
                result.intent,

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