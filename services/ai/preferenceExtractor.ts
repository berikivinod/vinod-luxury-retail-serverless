import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";

import type {
    StylePreferences,
} from "@/types/ai";

/*
 * GPT returns null for preferences
 * that the customer has not provided.
 *
 * Strict JSON schemas require every
 * property to be included in required.
 */
export interface AIExtractedPreferences {

    category: string | null;

    productType: string | null;

    occasion: string | null;

    gender: string | null;

    color: string | null;

    size: string | null;

    brand: string | null;

    style: string | null;

    minPrice: number | null;

    maxPrice: number | null;

}

/*
 * Convert GPT nullable preferences
 * into our application's
 * StylePreferences type.
 */

export function normalizePreferences(
    extracted: AIExtractedPreferences
): StylePreferences {

    return {

        category:
            extracted.category ??
            undefined,

        productType:
            extracted.productType ??
            undefined,

        occasion:
            extracted.occasion ??
            undefined,

        gender:
            extracted.gender ??
            undefined,

        color:
            extracted.color ??
            undefined,

        size:
            extracted.size ??
            undefined,

        brand:
            extracted.brand ??
            undefined,

        style:
            extracted.style ??
            undefined,

        minPrice:
            extracted.minPrice ??
            undefined,

        maxPrice:
            extracted.maxPrice ??
            undefined,

    };

}

/*
 * Extract the customer's CURRENT
 * shopping preferences.
 *
 * This happens BEFORE product search.
 *
 * This is the important Phase 2.3
 * architectural change.
 */

export async function extractCurrentPreferences(

    fullConversation: string,

    latestMessage: string,

    previousPreferences?:
        StylePreferences,

    previousResponseId?:
        string

): Promise<{

    preferences:
        StylePreferences;

    responseId:
        string;

}> {


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

${latestMessage}

Previously known structured preferences:

${JSON.stringify(
    previousPreferences || {},
    null,
    2
)}

Determine the customer's CURRENT
shopping preferences.

Keep all previously stated
requirements unless the customer
has changed them.

If the customer changes a
preference, replace the old value
with the new value.

For example:

Customer:
"I prefer loafers."

Later:
"Actually, I prefer boots."

The current productType must be:
"Boots"

not:
"Loafers"

Return the complete current
preference state.

Use null for information that is
still unknown.

Do not invent preferences.`,

            },

        ],

       instructions:
    `You are the preference
     extraction component of the
     Vinod Luxury Retailers AI
     Style Advisor.

     Your job is to maintain the
     customer's CURRENT shopping
     preference state.

     Track:

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

     IMPORTANT CATEGORY RULE:

     The "category" field represents
     the broad product department.

     Valid category examples include:

     - Shoes
     - Handbags
     - Jewelry
     - Clothing
     - Accessories
     - Beauty
     - Kids
     - Home

     IMPORTANT PRODUCT TYPE RULE:

     The "productType" field represents
     the specific type of product within
     a category.

     For shoes, examples include:

     - Loafers
     - Boots
     - Sneakers
     - Pumps

     For handbags, examples include:

     - Tote
     - Shoulder Bag
     - Crossbody
     - Clutch

     NEVER put a category into
     productType.

     NEVER put a product type into
     category.

     Example 1:

     Customer:
     "I need shoes."

     Correct:

     category = "Shoes"
     productType = null

     Incorrect:

     category = null
     productType = "Shoes"

     Example 2:

     Customer:
     "I need interview shoes."

     Correct:

     category = "Shoes"
     productType = null
     occasion = "Interview"

     Example 3:

     Customer:
     "I prefer loafers."

     Correct:

     category = "Shoes"
     productType = "Loafers"

     Example 4:

     Customer:
     "Actually, I prefer boots."

     Correct:

     category = "Shoes"
     productType = "Boots"

     Preserve previous preferences
     when they are still valid.

     When the customer explicitly
     changes a preference, replace
     the previous value.

     The latest explicit customer
     preference wins.

     Never invent preferences.

     Use null when unknown.`,

        text: {

            format: {

                type: "json_schema",

                name:
                    "style_advisor_preferences",

                strict: true,

                schema: {

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

        },

    };


    /*
     * Continue the existing OpenAI
     * conversation if one exists.
     */

    if (previousResponseId) {

        request.previous_response_id =
            previousResponseId;

    }


    const response =
        await openai.responses.create(
            request
        );


    if (!("output_text" in response)) {

        throw new Error(
            "Unexpected streaming response while extracting preferences."
        );

    }


    let parsed:

        AIExtractedPreferences;


    try {

        parsed =
            JSON.parse(
                response.output_text
            );

    } catch (error) {

        console.error(
            "Unable to parse preference extraction response:",
            error
        );

        console.error(
            "AI preference output:",
            response.output_text
        );

        throw new Error(
            "AI returned invalid shopping preferences."
        );

    }


    const preferences =
        normalizePreferences(
            parsed
        );


    console.log(
        "Extracted Current Preferences:",
        preferences
    );


    return {

        preferences,

        responseId:
            response.id,

    };

}