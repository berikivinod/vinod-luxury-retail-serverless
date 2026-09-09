import type {
    AIRecommendation,
    StylePreferences,
} from "@/types/ai";

import {
    getProductsByIds,
} from "./productSearch";

import {
    resolveSelectedProduct,
} from "./productSelector";

/*
 * ----------------------------------------
 * SELECT
 * ----------------------------------------
 */
export type SelectionHandlerResult = {

    handled: boolean;

    reply?: string;

    recommendations?: AIRecommendation[];

    preferences?: StylePreferences;

};


export async function handleProductSelection(
    message: string,
    previouslyShownProductIds: number[],
    preferences: StylePreferences,
    responseId: string
): Promise<SelectionHandlerResult> {

    console.log(
        "SELECT: Loading previously shown products only:",
        previouslyShownProductIds
    );


    const products =
        await getProductsByIds(
            previouslyShownProductIds
        );


    console.log(
        "Products Available For Selection:",
        products.map(
            (product) => ({
                id: product.id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                price: product.price,
            })
        )
    );


    const selection =
        resolveSelectedProduct(
            message,
            previouslyShownProductIds,
            products
        );


    /*
     * Invalid option.
     */

    if (
        selection.optionNumber !== null &&
        !selection.product
    ) {

        const reply =
            `I don't have an option ${selection.optionNumber} in the products I just showed you. Please choose one of the displayed options.`;


        console.log(
            "SELECT: Invalid option:",
            selection.optionNumber
        );


        return {

            handled: true,

            reply,

            recommendations: [],

            preferences,

        };

    }


    /*
     * Ambiguous selection.
     *
     * Example:
     *
     * "I'll take the loafers"
     *
     * when two loafers were displayed.
     */

    if (
        selection.ambiguous.length > 1
    ) {

        const options =
            selection.ambiguous
                .map(
                    (product) =>
                        `${product.name} ($${product.price})`
                )
                .join(
                    " or "
                );


        const reply =
            `I found more than one matching option: ${options}. Which one would you like?`;


        console.log(
            "SELECT: Ambiguous selection:",
            selection.ambiguous.map(
                (product) =>
                    product.id
            )
        );


        return {

            handled: true,

            reply,

            recommendations: [],

            preferences,

        };

    }


    /*
     * Product successfully selected.
     */

    if (
        selection.product
    ) {

        const product =
            selection.product;


        console.log(
            "SELECT: Selected Product:",
            {
                id:
                    product.id,

                name:
                    product.name,

                price:
                    product.price,
            }
        );


        const recommendation:
            AIRecommendation = {

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
                `You selected this option: ${product.name}.`,

        };


        return {

            handled: true,

            reply:
                `Great choice. You selected ${product.name} from ${product.brand} for $${product.price}.`,

            recommendations: [
                recommendation,
            ],

            preferences,

        };

    }


    /*
     * We could not determine the
     * customer's selection.
     */

    return {

        handled: true,

        reply:
            "Which option would you like to select? You can say something like 'option 1' or name the product.",

        recommendations: [],

        preferences,

    };

}