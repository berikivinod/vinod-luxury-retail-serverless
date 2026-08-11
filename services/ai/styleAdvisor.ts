import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";

import {
    searchProductsForAI,
} from "./productSearch";

import {
    AIRecommendation,
} from "@/types/ai";

export interface StyleAdvisorResult {

    reply: string;

    responseId: string;

    recommendations:
        AIRecommendation[];

}

interface AIProductSelection {

    productIds: number[];

    reply: string;

    reasons: {

        productId: number;

        reason: string;

    }[];

}

export async function askStyleAdvisor(

    message: string,

    previousResponseId?: string,

    conversationContext?: string

): Promise<StyleAdvisorResult> {

    /*
     * Search the actual product catalog
     * using the complete conversation context.
     *
     * This is important for multi-turn
     * conversations.
     */

    const products =
        await searchProductsForAI(

            conversationContext ||
            message

        );

    /*
     * Log candidates temporarily so we
     * can verify multi-turn product search.
     */

    console.log(
        "AI Product Candidates:",
        products.map((product) => ({

            id:
                product.id,

            name:
                product.name,

            brand:
                product.brand,

            category:
                product.category,

            price:
                product.price,

        }))

    );

    /*
     * Prepare a smaller catalog for GPT.
     */

    const productCatalog =
        products.map((product) => ({

            id:
                product.id,

            name:
                product.name,

            brand:
                product.brand,

            category:
                product.category,

            price:
                product.price,

            description:
                product.description,

        }));

    /*
     * Ask GPT to select product IDs only.
     *
     * The application builds the actual
     * recommendation objects from real
     * catalog products.
     */

    const request:
        ResponseCreateParamsNonStreaming = {

        model: "gpt-5",

        stream: false,

        input: [

            {

                role: "user",

                content:
                    `Customer conversation:

${conversationContext || message}

Latest customer message:

${message}

Available products:

${JSON.stringify(
    productCatalog,
    null,
    2
)}

Select the products that best match
the customer's complete conversation.

Only select products from the
provided catalog.

Use all relevant requirements from
the conversation.

Respect the customer's stated budget.

If the customer has requested a
specific category, prioritize that
category.

If appropriate products exist,
return their product IDs.

If no suitable products exist,
return an empty productIds array.

Provide a short reason for each
selected product.`,

            },

        ],

        instructions:
            `You are the AI Style Advisor
             for Vinod Luxury Retailers.

             Act like an experienced luxury
             fashion sales associate.

             Understand the customer's
             complete conversation, not
             just the latest message.

             Remember requirements such as:

             - product category
             - product type
             - occasion
             - budget
             - style preference
             - other shopping requirements

             Select products only from the
             supplied catalog.

             Never invent products.

             Never invent product IDs.

             Never invent prices.

             Never invent brands.

             Respect the customer's budget.

             Select up to three products.

             If suitable products exist,
             select them.

             Give a concise reason for each
             selected product.

             Keep the conversational reply
             natural and concise.

             Ask one or two follow-up
             questions when useful.`,

        text: {

            format: {

                type: "json_schema",

                name:
                    "style_advisor_selection",

                strict: true,

                schema: {

                    type: "object",

                    properties: {

                        reply: {

                            type: "string",

                        },

                        productIds: {

                            type: "array",

                            items: {

                                type:
                                    "number",

                            },

                        },

                        reasons: {

                            type: "array",

                            items: {

                                type: "object",

                                properties: {

                                    productId: {

                                        type:
                                            "number",

                                    },

                                    reason: {

                                        type:
                                            "string",

                                    },

                                },

                                required: [

                                    "productId",

                                    "reason",

                                ],

                                additionalProperties:
                                    false,

                            },

                        },

                    },

                    required: [

                        "reply",

                        "productIds",

                        "reasons",

                    ],

                    additionalProperties:
                        false,

                },

            },

        },

    };

    /*
     * Continue the OpenAI conversation
     * when a previous response exists.
     */

    if (previousResponseId) {

        request.previous_response_id =
            previousResponseId;

    }

    /*
     * Call OpenAI.
     */

    const response =
        await openai.responses.create(
            request
        );

    if (!("output_text" in response)) {

        throw new Error(
            "Unexpected streaming response."
        );

    }

    /*
     * Parse structured AI response.
     */

    let parsedResponse:
        AIProductSelection;

    try {

        parsedResponse =
            JSON.parse(
                response.output_text
            );

    } catch (error) {

        console.error(
            "Unable to parse AI response:",
            error
        );

        console.error(
            "AI output:",
            response.output_text
        );

        throw new Error(
            "AI returned an invalid response."
        );

    }

    /*
     * Build recommendations ONLY from
     * real products returned by our
     * Products API.
     */

    const recommendations:
        AIRecommendation[] =
        parsedResponse.productIds

            .map((productId) => {

                const product =
                    products.find(
                        (item) =>
                            item.id ===
                            productId
                    );

                if (!product) {

                    return null;

                }

                const reason =
                    parsedResponse.reasons
                        .find(
                            (item) =>
                                item.productId ===
                                productId
                        );

                return {

                    productId:
                        product.id,

                    name:
                        product.name,

                    brand:
                        product.brand,

                    category:
                        product.category,

                    image:
                        product.image,

                    price:
                        product.price,

                    reason:
                        reason?.reason ||
                        "A strong match for your request.",

                };

            })

            .filter(
                (
                    item
                ): item is AIRecommendation =>
                    item !== null
            )

            .slice(0, 3);

    console.log(
        "AI Selected Product IDs:",
        parsedResponse.productIds
    );

    console.log(
        "Final Recommendations:",
        recommendations
    );

    return {

        reply:
            parsedResponse.reply,

        responseId:
            response.id,

        recommendations,

    };

}