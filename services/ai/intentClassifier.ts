import type {
    ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

import { openai } from "./client";
import {
    StyleAdvisorIntent
} from "@/types/ai";

export async function extractIntent(
    message: string
): Promise<StyleAdvisorIntent> {

    const request:
        ResponseCreateParamsNonStreaming = {

        model: "gpt-5",

        stream: false,

        input: [

            {

                role: "user",

                content:
                    `Customer's latest message:

${message}

Determine the customer's
conversation intent.`,

            },

        ],

        instructions:
            `You are the conversation
             intent classifier for the
             Vinod Luxury Retailers AI
             Style Advisor.

             Classify the customer's
             latest message into exactly
             one intent.

             SHOP:
             The customer is making a
             new shopping request or
             asking for products.

             REFINE:
             The customer is changing or
             adding a shopping preference.

             SHOW_ALTERNATIVE:
             The customer wants another
             or different option instead
             of a product already shown.

             SHOW_MORE:
             The customer wants additional
             products.

             COMPARE:
             The customer wants to compare
             products that were already shown.

             SELECT:
             The customer is choosing or
             selecting a product that was
             already shown.

             SELECT should be used when
             the customer indicates they
             want to take, buy, choose,
             select, or proceed with a
             previously shown product.

             Examples:

             "I need shoes"
             => SHOP

             "I need interview shoes"
             => SHOP

             "I prefer loafers"
             => REFINE

             "Actually I want boots"
             => REFINE

             "Show me another option"
             => SHOW_ALTERNATIVE

             "Do you have anything else?"
             => SHOW_ALTERNATIVE

             "Show me a different one"
             => SHOW_ALTERNATIVE

             "Show me more"
             => SHOW_MORE

             "Give me some more choices"
             => SHOW_MORE

             "Which one is better?"
             => COMPARE

             "Compare these options"
             => COMPARE

             "I'll take option 1"
             => SELECT

             "I want option 2"
             => SELECT

             "I'll take the first one"
             => SELECT

             "I want the second one"
             => SELECT

             "I'll take the loafers"
             => SELECT

             "I want the boots"
             => SELECT

             "I'll take that one"
             => SELECT

             "I want to buy this one"
             => SELECT

             Important:

             If the customer is selecting
             something that was already
             shown, classify it as SELECT
             rather than SHOP or REFINE.

             Return only the
             classification required
             by the schema.`,

        text: {

            format: {

                type: "json_schema",

                name:
                    "style_advisor_intent",

                strict: true,

                schema: {

                    type: "object",

                    properties: {

                        intent: {

                            type: "string",

                            enum: [

                                "SHOP",

                                "REFINE",

                                "SHOW_ALTERNATIVE",

                                "SHOW_MORE",

                                "COMPARE",

                                "SELECT",

                            ],

                        },

                    },

                    required: [

                        "intent",

                    ],

                    additionalProperties:
                        false,

                },

            },

        },

    };


    const response =
        await openai.responses.create(
            request
        );


    if (!("output_text" in response)) {

        throw new Error(
            "Unable to extract AI conversation intent."
        );

    }


    let parsedResponse: {
        intent: StyleAdvisorIntent;
    };


    try {

        parsedResponse =
            JSON.parse(
                response.output_text
            );

    } catch (error) {

        console.error(
            "Unable to parse AI intent:",
            error
        );

        console.error(
            "AI intent output:",
            response.output_text
        );

        throw new Error(
            "AI returned an invalid conversation intent."
        );

    }


    console.log(
        "AI Conversation Intent:",
        parsedResponse.intent
    );


    return parsedResponse.intent;

}