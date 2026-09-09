import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";

import type {
    StylePreferences,
    AIProductSelection,
} from "@/types/ai";



export type ComparisonProduct = {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    image: string;
};


export async function compareProducts(

    customerRequest: string,

    products: ComparisonProduct[],

    preferences: StylePreferences

): Promise<AIProductSelection> {


    /*
     * Only the products supplied by the
     * application may be compared.
     */

    const productContext =
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
     * Dedicated comparison prompt.
     *
     * This is intentionally separate from
     * the normal product-selection prompt.
     */

    const request:
        ResponseCreateParamsNonStreaming = {

        model:
            process.env.OPENAI_MODEL ||
            "gpt-5-mini",

        stream: false,

        input: [

            {

                role: "user",

                content:
                    `Customer request:

${customerRequest}

Current shopping preferences:

${JSON.stringify(
    preferences,
    null,
    2
)}

Products available for comparison:

${JSON.stringify(
    productContext,
    null,
    2
)}

The customer wants to compare
these products.

Compare ONLY the products supplied
above.

Do not introduce any other products.

Do not invent product information.

Do not invent prices.

Do not invent brands.

Do not invent product IDs.

Use the actual catalog information
provided.

Consider the customer's current
shopping preferences.

Explain the important differences
and trade-offs between the products.

Help the customer understand which
product is better for different
priorities.

For example, identify:

- best overall option
- best value when supported by price
- most formal option when supported
  by the product information
- best option for the customer's
  stated occasion

Only make claims that are supported
by the supplied product information
or are reasonable conclusions from
that information.

Return the products that you actually
compared in productIds.

Provide one concise comparison reason
for each returned product.`,

            },

        ],


        instructions:

            `You are the product-comparison
             component of the Vinod Luxury
             Retailers AI Style Advisor.

             Your job is to compare products
             that have ALREADY been shown to
             the customer.

             The supplied product catalog is
             authoritative.

             Compare ONLY supplied products.

             Never introduce another product.

             Never invent:

             - products
             - product IDs
             - prices
             - brands
             - product features
             - materials
             - colors
             - sizes
             - availability
             - comfort claims
             - weather claims
             - durability claims

             Use the customer's CURRENT
             structured preferences as the
             primary context.

             Explain meaningful differences
             and trade-offs.

             The comparison should help the
             customer make a decision.

             Keep the conversational response
             concise and natural.

             Return only products that were
             actually supplied to you.`,

        
        text: {

            format: {

                type: "json_schema",

                name:
                    "style_advisor_comparison",

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
     * Call OpenAI.
     */

    const response =
        await openai.responses.create(

            request

        );


    /*
     * Parse the structured response.
     */

    const output =
        JSON.parse(

            response.output_text

        ) as AIProductSelection;


    /*
     * Security / correctness guard.
     *
     * GPT may only return IDs that were
     * actually supplied to this method.
     */

    const allowedProductIds =
        new Set(

            products.map(

                (product) =>
                    product.id

            )

        );


    output.productIds =
        output.productIds.filter(

            (productId) =>
                allowedProductIds.has(
                    productId
                )

        );


    /*
     * Keep reasons synchronized with
     * the allowed product IDs.
     */

    output.reasons =
        output.reasons.filter(

            (item) =>
                allowedProductIds.has(
                    item.productId
                )

        );


    /*
     * Make sure every selected product
     * has a corresponding reason.
     */

    output.productIds =
        output.productIds.filter(

            (productId) =>
                output.reasons.some(

                    (item) =>
                        item.productId ===
                        productId

                )

        );


    console.log(

        "AI Compared Product IDs:",

        output.productIds

    );


    console.log(

        "AI Comparison Reasons:",

        output.reasons

    );


    return output;

}