import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";

import {
    searchProductsForAI,
} from "./productSearch";

import {
    AIRecommendation,
    StylePreferences,
} from "@/types/ai";


export interface StyleAdvisorResult {

    reply: string;

    responseId: string;

    recommendations:
        AIRecommendation[];

    preferences:
        StylePreferences;

}


/*
 * GPT returns null for preferences
 * that the customer has not provided.
 *
 * This is required because OpenAI strict
 * JSON schemas require every property to
 * be required.
 */
interface AIExtractedPreferences {

    category:
        string | null;

    productType:
        string | null;

    occasion:
        string | null;

    gender:
        string | null;

    color:
        string | null;

    size:
        string | null;

    brand:
        string | null;

    style:
        string | null;

    minPrice:
        number | null;

    maxPrice:
        number | null;

}


interface AIProductSelection {

    productIds: number[];

    reply: string;

    reasons: {

        productId: number;

        reason: string;

    }[];

    preferences:
        AIExtractedPreferences;

}


export async function askStyleAdvisor(

    message: string,

    previousResponseId?: string,

    conversationContext?: string,

    currentPreferences?: StylePreferences

): Promise<StyleAdvisorResult> {


    /*
     * Use the complete conversation for
     * product searching.
     */

    const fullConversation =
        conversationContext ||
        message;


    /*
     * Search the actual product catalog.
     *
     * IMPORTANT:
     *
     * Pass the structured preferences
     * into productSearch so hard filters
     * such as budget and category can be
     * applied before products are sent
     * to GPT.
     */

    const products =
        await searchProductsForAI(

            fullConversation,

            currentPreferences

        );


    /*
     * Log candidates temporarily.
     */

    console.log(
        "AI Product Candidates:",
        products.map(
            (product) => ({

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

            })
        )
    );


    /*
     * Prepare a smaller catalog for GPT.
     */

    const productCatalog =
        products.map(
            (product) => ({

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

            })
        );


    /*
     * Ask GPT to understand the
     * customer's requirements and
     * select products.
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

${fullConversation}

Latest customer message:

${message}

Current structured preferences:

${JSON.stringify(
    currentPreferences || {},
    null,
    2
)}

Available products:

${JSON.stringify(
    productCatalog,
    null,
    2
)}

Analyze the customer's complete
conversation.

Update the customer's current
shopping preferences based on
everything they have said.

Keep previously stated requirements.

If the customer changes a
requirement, update it.

Do not invent preferences.

Use null for preferences that
the customer has not provided.

Then select the products that best
match the customer's current
requirements.

Only select products from the
provided catalog.

Respect the customer's stated
budget.

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
             complete conversation.

             Maintain structured shopping
             preferences throughout the
             conversation.

             Track these preferences:

             - category
             - product type
             - occasion
             - gender
             - color
             - size
             - brand
             - style
             - minimum price
             - maximum price

             When the customer gives a new
             preference, add it.

             When the customer changes a
             preference, update it.

             Never invent a preference that
             the customer did not provide.

             Use null when a preference is
             unknown.

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


                        preferences: {

                            type: "object",

                            properties: {

                                category: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                productType: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                occasion: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                gender: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                color: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                size: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                brand: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                style: {

                                    type: [
                                        "string",
                                        "null",
                                    ],

                                },

                                minPrice: {

                                    type: [
                                        "number",
                                        "null",
                                    ],

                                },

                                maxPrice: {

                                    type: [
                                        "number",
                                        "null",
                                    ],

                                },

                            },

                            /*
                             * IMPORTANT:
                             *
                             * With strict JSON schema,
                             * every property must be
                             * included here.
                             */

                            required: [

                                "category",

                                "productType",

                                "occasion",

                                "gender",

                                "color",

                                "size",

                                "brand",

                                "style",

                                "minPrice",

                                "maxPrice",

                            ],

                            additionalProperties:
                                false,

                        },

                    },

                    required: [

                        "reply",

                        "productIds",

                        "reasons",

                        "preferences",

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


    /*
     * Make sure this is a normal
     * non-streaming response.
     */

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
     * Convert GPT null values into
     * undefined values expected by our
     * TypeScript StylePreferences type.
     */

    const preferences:
        StylePreferences = {

        category:
            parsedResponse.preferences.category ||
            undefined,

        productType:
            parsedResponse.preferences.productType ||
            undefined,

        occasion:
            parsedResponse.preferences.occasion ||
            undefined,

        gender:
            parsedResponse.preferences.gender ||
            undefined,

        color:
            parsedResponse.preferences.color ||
            undefined,

        size:
            parsedResponse.preferences.size ||
            undefined,

        brand:
            parsedResponse.preferences.brand ||
            undefined,

        style:
            parsedResponse.preferences.style ||
            undefined,

        minPrice:
            parsedResponse.preferences.minPrice ??
            undefined,

        maxPrice:
            parsedResponse.preferences.maxPrice ??
            undefined,

    };


    /*
     * Build recommendations ONLY from
     * real products returned by our
     * Products API.
     */

    const recommendations:
        AIRecommendation[] =

        parsedResponse.productIds

            .map(
                (productId) => {

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

                }
            )

            .filter(
                (
                    item
                ): item is AIRecommendation =>
                    item !== null
            )

            .slice(
                0,
                3
            );


    /*
     * Debug logging.
     */

    console.log(
        "AI Selected Product IDs:",
        parsedResponse.productIds
    );


    console.log(
        "AI Style Preferences:",
        preferences
    );


    console.log(
        "Final Recommendations:",
        recommendations
    );


    /*
     * Return the complete result.
     */

    return {

        reply:
            parsedResponse.reply,

        responseId:
            response.id,

        recommendations,

        preferences,

    };

}