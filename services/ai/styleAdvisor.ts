import {
    searchProductsForAI,
    getProductsByIds,
} from "./productSearch";

import {
    buildRecommendations,
} from "./recommendationBuilder";

import {
    selectProducts,
} from "./productRecommender";

import {
    AIRecommendation,
    StylePreferences,
    StyleAdvisorIntent,
} from "@/types/ai";

import {
    extractIntent,
} from "./intentClassifier";

import {
    compareProducts,
} from "./productComparator";

import {
    handleProductSelection,
} from "./productSelectionHandler";

import {
    extractCurrentPreferences,
} from "./preferenceExtractor";


export interface StyleAdvisorResult {

    reply: string;

    responseId: string;

    recommendations:
        AIRecommendation[];

    preferences:
        StylePreferences;

    intent:
        StyleAdvisorIntent;

}

type StyleAdvisorAIResult = {

    selection: {

        reply: string;

        productIds: number[];

        reasons: {

            productId: number;

            reason: string;

        }[];

    };

    responseId: string;

};


/*
 * Main Style Advisor function.
 */

export async function askStyleAdvisor(

    message: string,

    previousResponseId?: string,

    conversationContext?: string,

    currentPreferences?: StylePreferences,

    previouslyShownProductIds: number[] = []

): Promise<StyleAdvisorResult> {


    /*
     * ----------------------------------------
     * STEP 1
     * ----------------------------------------
     *
     * Determine the customer's conversation
     * intent from the latest message.
     */

    const intent =
        await extractIntent(
            message
        );


    console.log(
        "Current AI Intent:",
        intent
    );


    /*
     * Products already shown to the customer
     * should only be excluded when the customer
     * explicitly asks for another/more products.
     */

    const excludeProductIds =
        intent === "SHOW_ALTERNATIVE" ||
        intent === "SHOW_MORE"
            ? previouslyShownProductIds
            : [];


    console.log(
        "Previously Shown Product IDs:",
        previouslyShownProductIds
    );


    console.log(
        "Product IDs Excluded From Search:",
        excludeProductIds
    );


    /*
     * Use the complete conversation.
     */

    const fullConversation =
        conversationContext ||
        message;


    /*
     * ----------------------------------------
     * STEP 2
     * ----------------------------------------
     *
     * Extract CURRENT preferences FIRST.
     *
     * This is the key Phase 2.3 fix.
     */

    const extracted =
        await extractCurrentPreferences(

            fullConversation,

            message,

            currentPreferences,

            previousResponseId

        );


    const preferences =
        extracted.preferences;


    console.log(
        "Current Preferences Used For Search:",
        preferences
    );


    /*
     * ----------------------------------------
     * SELECT
     * ----------------------------------------
     *
     * Selection operates ONLY on products
     * that were previously shown.
     */

    if (
        intent === "SELECT"
    ) {

        const selection =
            await handleProductSelection(

                message,

                previouslyShownProductIds,

                preferences,

                extracted.responseId

            );


        return {

            reply:
                selection.reply || "",

            responseId:
                extracted.responseId,

            recommendations:
                selection.recommendations || [],

            preferences,

            intent,

        };

    }


    /*
     * ----------------------------------------
     * STEP 3
     * PRODUCT LOADING
     * ----------------------------------------
     *
     * COMPARE:
     * Load ONLY previously shown products.
     *
     * All other shopping intents:
     * Search the catalog normally.
     */

    const products =
        intent === "COMPARE"

            ? await getProductsByIds(
                  previouslyShownProductIds
              )

            : await searchProductsForAI(

                  fullConversation,

                  preferences,

                  excludeProductIds

              );


    /*
     * Comparison debugging.
     */

    if (
        intent === "COMPARE"
    ) {

        console.log(
            "COMPARE: Loading previously shown products only:",
            previouslyShownProductIds
        );


        console.log(
            "Products Loaded For Comparison:",

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

    }


    /*
     * ----------------------------------------
     * STEP 3.5
     * ----------------------------------------
     *
     * Intelligent no-result handling.
     *
     * If the product search returns no
     * products, do NOT call the final
     * product-selection AI.
     *
     * The search layer is authoritative
     * for product availability.
     */

    if (
        products.length === 0
    ) {

        console.log(
            "No products match the customer's hard requirements."
        );


        let fallbackReply =
            "I couldn't find another product that matches your current requirements.";


        if (
            intent === "SHOW_ALTERNATIVE" ||
            intent === "SHOW_MORE"
        ) {

            fallbackReply =
                "I don't have another option that matches your current requirements. " +
                "Would you like to change the budget, product style, or another preference?";

        } else {

            fallbackReply =
                "I couldn't find a product that matches all of your current requirements. " +
                "Would you like to change the budget, product style, or another preference?";

        }


        console.log(
            "No-Result Fallback:",
            fallbackReply
        );


        return {

            reply:
                fallbackReply,

            responseId:
                extracted.responseId,

            recommendations:
                [],

            preferences,

            intent,

        };

    }


    /*
     * ----------------------------------------
     * DEBUG
     * ----------------------------------------
     *
     * Log candidates.
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
     * ----------------------------------------
     * STEP 4
     * ----------------------------------------
     *
     * Ask the appropriate AI component.
     *
     * COMPARE:
     * compare previously shown products.
     *
     * Everything else:
     * select products from the catalog.
     */

    let selected:
        StyleAdvisorAIResult;


    if (
        intent === "COMPARE"
    ) {

        selected = {

            selection:
                await compareProducts(

                    message,

                    products,

                    preferences

                ),

            responseId:
                extracted.responseId,

        };

    } else {

        /*
         * Prepare catalog for the final
         * product-selection GPT call.
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


        selected =
            await selectProducts(

                fullConversation,

                message,

                preferences,

                productCatalog,

                extracted.responseId

            );

    }


    const parsedResponse =
        selected.selection;


    /*
     * ----------------------------------------
     * STEP 5
     * ----------------------------------------
     *
     * Build recommendations ONLY from
     * real products returned by the
     * Products API.
     */

    const recommendations =
        buildRecommendations(

            parsedResponse.productIds,

            parsedResponse.reasons,

            products

        );


    /*
     * ----------------------------------------
     * DEBUG LOGGING
     * ----------------------------------------
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
     * ----------------------------------------
     * FINAL RESULT
     * ----------------------------------------
     */

    return {

        reply:
            parsedResponse.reply,

        responseId:
            selected.responseId,

        recommendations,

        preferences,

        intent,

    };

}