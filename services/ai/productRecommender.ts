import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";

import type {
    StylePreferences,
    AIProductSelection,
} from "@/types/ai";


export type RecommendationProduct = {

    id: number;

    name: string;

    brand: string;

    category: string;

    price: number;

    description: string;

};

/*
 * Ask GPT to select products from the
 * already-ranked product candidates.
 */


export async function selectProducts(

    fullConversation: string,

    latestMessage: string,

    preferences: StylePreferences,

    productCatalog: RecommendationProduct[],

    previousResponseId: string

): Promise<{

    selection: AIProductSelection;

    responseId: string;

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

CURRENT shopping preferences:

${JSON.stringify(
    preferences,
    null,
    2
)}

Available products:

${JSON.stringify(
    productCatalog,
    null,
    2
)}

Select the products that best
match the customer's CURRENT
requirements.

Important rules:

- Only select products from the
  supplied catalog.
- Never invent products.
- Never invent product IDs.
- Never invent prices.
- Never invent brands.
- Respect the current budget.
- Respect the current category.
- Respect the current product type.
- Respect the current occasion.
- Respect other current preferences.
- Select up to three products.
- If appropriate products exist,
  select them.
- If no suitable products exist,
  return an empty productIds array.
- Provide a short reason for every
  selected product.

The CURRENT preferences are the
source of truth.

If the customer previously said
"loafers" but later said
"actually I prefer boots", treat
"boots" as the current preference.`,

            },

        ],

        instructions:
            `You are the product-selection
             component of the Vinod Luxury
             Retailers AI Style Advisor.

             Act like an experienced luxury
             fashion sales associate.

             The customer's CURRENT
             structured preferences are
             authoritative.

             Select products only from the
             supplied catalog.

             Never invent products.

             Never invent product IDs.

             Never invent prices.

             Never invent brands.

             Respect the customer's current
             budget.

             Respect the customer's current
             product type.

             Respect the customer's current
             occasion.

             Select up to three products.

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

                            type:
                                "string",

                        },

                        productIds: {

                            type:
                                "array",

                            items: {

                                type:
                                    "number",

                            },

                        },

                        reasons: {

                            type:
                                "array",

                            items: {

                                type:
                                    "object",

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
     * Continue from the preference
     * extraction response.
     *
     * This keeps the AI conversation
     * connected.
     */

    request.previous_response_id =
        previousResponseId;


    const response =
        await openai.responses.create(
            request
        );


    if (!("output_text" in response)) {

        throw new Error(
            "Unexpected streaming response while selecting products."
        );

    }


    let selection:
        AIProductSelection;


    try {

        selection =
            JSON.parse(
                response.output_text
            );

    } catch (error) {

        console.error(
            "Unable to parse product selection response:",
            error
        );

        console.error(
            "AI selection output:",
            response.output_text
        );

        throw new Error(
            "AI returned an invalid product selection."
        );

    }


    return {

        selection,

        responseId:
            response.id,

    };

}