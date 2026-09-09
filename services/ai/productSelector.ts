export type SelectionProduct = {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    image: string;
};

/*
 * Resolve a customer's selection against
 * products that were already shown.
 *
 * Examples:
 *
 * "I'll take option 1"
 * "I want option 2"
 * "I'll take the first one"
 * "I want the second one"
 *
 * The option number is resolved
 * deterministically from the order in
 * previouslyShownProductIds.
 */
export function resolveSelectedProduct(
    message: string,
    previouslyShownProductIds: number[],
    products: SelectionProduct[]
): {
    product: SelectionProduct | null;
    ambiguous: SelectionProduct[];
    optionNumber: number | null;

} {

    const normalizedMessage =
        message
            .toLowerCase()
            .trim();

    console.log(
    "SELECT RESOLVER MESSAGE:",
    message
);

console.log(
    "SELECT RESOLVER NORMALIZED MESSAGE:",
    normalizedMessage
);


    /*
     * ----------------------------------------
     * STEP 1
     *
     * Detect explicit option numbers.
     *
     * Examples:
     *
     * "option 1"
     * "option 2"
     * "number 1"
     * "choice 1"
     * "first one"
     * "second one"
     * "third one"
     * ----------------------------------------
     */

    let optionNumber: number | null = null;


    const numericMatch =
        normalizedMessage.match(
            /\b(?:option|choice|number|no\.?)\s*(?:#\s*)?(\d+)\b/
        );


    if (numericMatch) {

        optionNumber =
            Number(
                numericMatch[1]
            );

    }


    /*
     * Handle ordinal selections.
     */

    if (
        optionNumber === null &&
        /\b(first|1st)\b/.test(
            normalizedMessage
        )
    ) {

        optionNumber = 1;

    }


    if (
        optionNumber === null &&
        /\b(second|2nd)\b/.test(
            normalizedMessage
        )
    ) {

        optionNumber = 2;

    }


    if (
        optionNumber === null &&
        /\b(third|3rd)\b/.test(
            normalizedMessage
        )
    ) {

        optionNumber = 3;

    }


    if (
        optionNumber === null &&
        /\b(fourth|4th)\b/.test(
            normalizedMessage
        )
    ) {

        optionNumber = 4;

    }


    /*
     * ----------------------------------------
     * STEP 2
     *
     * Resolve explicit option number.
     * ----------------------------------------
     */

    if (
        optionNumber !== null
    ) {

        const productId =
            previouslyShownProductIds[
                optionNumber - 1
            ];


        if (
            productId !== undefined
        ) {

            const product =
                products.find(
                    (item) =>
                        item.id ===
                        productId
                );


            if (product) {

                return {

                    product,

                    ambiguous: [],

                    optionNumber,

                };

            }

        }


        /*
         * Invalid option number.
         */

        return {

            product: null,

            ambiguous: [],

            optionNumber,

        };

    }


    /*
     * ----------------------------------------
     * STEP 3
     *
     * Try price-based selection.
     *
     * Examples:
     *
     * "I'll take the $899 one."
     * "I'll take the 899 one."
     * "I'll take the $1,150 one."
     * "the $899 product"
     * ----------------------------------------
     */

    const priceMatch =
        normalizedMessage.match(
            /\$?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/
        );


    if (priceMatch) {

        const requestedPrice =
            Number(
                priceMatch[1].replace(
                    /,/g,
                    ""
                )
            );


        const priceMatches =
            products.filter(
                (product) =>
                    product.price ===
                    requestedPrice
            );


        /*
         * Exactly one product has
         * the requested price.
         */

        if (
            priceMatches.length === 1
        ) {

            return {

                product:
                    priceMatches[0],

                ambiguous: [],

                optionNumber: null,

            };

        }


        /*
         * More than one product has
         * the same price.
         */

        if (
            priceMatches.length > 1
        ) {

            return {

                product: null,

                ambiguous:
                    priceMatches,

                optionNumber: null,

            };

        }

    }


    /*
 * ----------------------------------------
 * STEP 4
 *
 * Try to identify a product from
 * its name / type.
 *
 * Matching priority:
 *
 * 1. Exact product name
 * 2. Product name contained in message
 * 3. Product type / individual words
 *
 * Examples:
 *
 * "I'll take the Premium Leather Loafers"
 *     -> Product 7
 *
 * "I'll take the loafers"
 *     -> Ambiguous [7, 6]
 *
 * ----------------------------------------
 */


/*
 * STEP 4A
 *
 * Exact / full product-name matching.
 */

const exactNameMatches =
    products.filter(
        (product) => {

            const productName =
                product.name
                    .toLowerCase()
                    .trim();

            return (
                normalizedMessage.includes(
                    productName
                )
            );

        }
    );


if (
    exactNameMatches.length === 1
) {

    return {

        product:
            exactNameMatches[0],

        ambiguous: [],

        optionNumber: null,

    };

}


if (
    exactNameMatches.length > 1
) {

    return {

        product: null,

        ambiguous:
            exactNameMatches,

        optionNumber: null,

    };

}


/*
 * STEP 4B
 *
 * Generic product-type matching.
 *
 * This must happen BEFORE distinctive
 * phrase matching.
 *
 * Example:
 *
 * "I'll take the loafers"
 *
 * Product 7 -> Premium Leather Loafers
 * Product 6 -> Leather Penny Loafers
 *
 * Result:
 *
 * ambiguous [7, 6]
 *
 * This prevents the phrase matcher from
 * incorrectly selecting one loafer.
 */
const genericTypeMatches =
    products.filter(
        (product) => {

            const productName =
                product.name
                    .toLowerCase()
                    .trim();

            const productNameWords =
                productName
                    .split(
                        /[\s\-]+/
                    )
                    .filter(
                        (word) =>
                            word.length >= 4
                    );

            /*
             * Look for product-type words
             * that appear in the customer's
             * message.
             *
             * The last meaningful word in
             * a product name is usually the
             * product type:
             *
             * Loafers
             * Pumps
             * Boots
             * Sneakers
             */
            const productType =
                productNameWords[
                    productNameWords.length - 1
                ];

            if (
                !productType
            ) {
                return false;
            }

            return normalizedMessage.includes(
                productType
            );
        }
    );


/*
 * More than one product matches the
 * requested product type.
 */
if (
    genericTypeMatches.length > 1
) {

    return {

        product: null,

        ambiguous:
            genericTypeMatches,

        optionNumber: null,

    };

}


/*
 * Exactly one product matches the
 * requested product type.
 *
 * Example:
 *
 * "I'll take the boots"
 *
 * If only one boot is displayed,
 * select it.
 */
if (
    genericTypeMatches.length === 1
) {

    return {

        product:
            genericTypeMatches[0],

        ambiguous: [],

        optionNumber: null,

    };

}


/*
 * STEP 4C
 *
 * Match distinctive phrases from
 * the product name.
 *
 * Examples:
 *
 * "I'll take the Premium Leather"
 *     -> Premium Leather Loafers
 *
 * "I'll take the Leather Penny"
 *     -> Leather Penny Loafers
 *
 * We only reach this section when
 * generic product-type matching did
 * not resolve the selection.
 */
const phraseMatches =
    products.filter(
        (product) => {

            const productName =
                product.name
                    .toLowerCase()
                    .trim();

            const productNameWords =
                productName
                    .split(
                        /[\s\-]+/
                    )
                    .filter(
                        (word) =>
                            word.length >= 4
                    );

            if (
                productNameWords.length < 2
            ) {

                return false;

            }


            /*
             * Do not count the final product
             * type word as a distinctive phrase.
             *
             * Example:
             *
             * Premium Leather Loafers
             *
             * "loafers"
             *
             * should NOT become a phrase
             * match.
             */
            const descriptiveWords =
                productNameWords.slice(
                    0,
                    -1
                );


            if (
                descriptiveWords.length === 0
            ) {

                return false;

            }


            const matchingWords =
                descriptiveWords.filter(
                    (word) =>
                        normalizedMessage.includes(
                            word
                        )
                );


            /*
             * At least one distinctive
             * descriptive word must match.
             *
             * Example:
             *
             * "Premium Leather"
             *
             * -> Premium Leather Loafers
             */
            return (
                matchingWords.length >= 1
            );

        }
    );


/*
 * Exactly one distinctive product
 * phrase matches.
 */
if (
    phraseMatches.length === 1
) {

    return {

        product:
            phraseMatches[0],

        ambiguous: [],

        optionNumber: null,

    };

}


/*
 * More than one distinctive phrase
 * matches.
 */
if (
    phraseMatches.length > 1
) {

    return {

        product: null,

        ambiguous:
            phraseMatches,

        optionNumber: null,

    };

}


/*
 * Nothing could be resolved.
 */
return {

    product: null,

    ambiguous: [],

    optionNumber: null,

};

    /*
     * ----------------------------------------
     * STEP 5
     *
     * Nothing could be resolved.
     * ----------------------------------------
     */

    return {

        product: null,

        ambiguous: [],

        optionNumber: null,

    };

}