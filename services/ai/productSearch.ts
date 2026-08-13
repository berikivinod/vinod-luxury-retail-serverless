import { Product } from "@/types/product";

import {
    StylePreferences,
} from "@/types/ai";

import {
    getProducts,
} from "@/services/products";


interface ProductScore {

    product: Product;

    score: number;

}


/*
 * Extract the customer's maximum budget.
 *
 * Examples:
 *
 * under $900
 * below $900
 * less than $900
 * up to $900
 * budget is $900
 * budget of $900
 */
function extractMaxPrice(
    request: string
): number | undefined {

    const patterns = [

        /(?:under|below|less than|up to)\s*\$?(\d+(?:\.\d+)?)/i,

        /budget\s*(?:is|of)?\s*\$?(\d+(?:\.\d+)?)/i,

        /\$\s*(\d+(?:\.\d+)?)/i,

    ];


    for (const pattern of patterns) {

        const match =
            request.match(pattern);


        if (match) {

            return Number(match[1]);

        }

    }


    return undefined;

}


/*
 * Determine whether the customer is
 * specifically looking for shoes.
 */
function isShoeRequest(
    request: string
): boolean {

    return (

        request.includes("shoe") ||
        request.includes("shoes") ||
        request.includes("footwear") ||
        request.includes("loafer") ||
        request.includes("boot") ||
        request.includes("sneaker") ||
        request.includes("pump")

    );

}


/*
 * Determine whether the customer is
 * specifically looking for handbags.
 */
function isHandbagRequest(
    request: string
): boolean {

    return (

        request.includes("bag") ||
        request.includes("handbag") ||
        request.includes("tote") ||
        request.includes("purse")

    );

}


/*
 * Determine whether the customer is
 * specifically looking for jewelry.
 */
function isJewelryRequest(
    request: string
): boolean {

    return (

        request.includes("jewelry") ||
        request.includes("jewellery") ||
        request.includes("necklace") ||
        request.includes("bracelet")

    );

}


/*
 * Determine whether the customer is
 * specifically looking for clothing.
 */
function isClothingRequest(
    request: string
): boolean {

    return (

        request.includes("clothing") ||
        request.includes("shirt") ||
        request.includes("dress") ||
        request.includes("blazer") ||
        request.includes("jacket")

    );

}


/*
 * Get the customer's requested category.
 */
function getRequestedCategory(
    request: string
): string | undefined {

    if (isShoeRequest(request)) {

        return "shoes";

    }


    if (isHandbagRequest(request)) {

        return "handbags";

    }


    if (isJewelryRequest(request)) {

        return "jewelry";

    }


    if (isClothingRequest(request)) {

        return "clothing";

    }


    return undefined;

}


/*
 * Determine interview/formal intent.
 */
function isInterviewRequest(
    request: string
): boolean {

    return (

        request.includes("interview") ||
        request.includes("business meeting") ||
        request.includes("formal") ||
        request.includes("professional")

    );

}


/*
 * Determine specific product intent.
 */
function hasProductIntent(
    request: string,
    productName: string
): boolean {

    const name =
        productName.toLowerCase();


    if (
        request.includes("loafer") &&
        name.includes("loafer")
    ) {

        return true;

    }


    if (
        request.includes("boot") &&
        name.includes("boot")
    ) {

        return true;

    }


    if (
        request.includes("sneaker") &&
        name.includes("sneaker")
    ) {

        return true;

    }


    if (
        request.includes("pump") &&
        name.includes("pump")
    ) {

        return true;

    }


    if (
        request.includes("tote") &&
        name.includes("tote")
    ) {

        return true;

    }


    if (
        request.includes("dress") &&
        name.includes("dress")
    ) {

        return true;

    }


    if (
        request.includes("blazer") &&
        name.includes("blazer")
    ) {

        return true;

    }


    if (
        request.includes("shirt") &&
        name.includes("shirt")
    ) {

        return true;

    }


    if (
        request.includes("jacket") &&
        name.includes("jacket")
    ) {

        return true;

    }


    if (
        request.includes("necklace") &&
        name.includes("necklace")
    ) {

        return true;

    }


    if (
        request.includes("bracelet") &&
        name.includes("bracelet")
    ) {

        return true;

    }


    if (
        request.includes("belt") &&
        name.includes("belt")
    ) {

        return true;

    }


    if (
        request.includes("sunglasses") &&
        name.includes("sunglasses")
    ) {

        return true;

    }


    return false;

}


/*
 * Check whether a preference has a
 * meaningful value.
 */
function hasPreference(
    value: string | undefined
): boolean {

    return Boolean(
        value &&
        value.trim()
    );

}


/*
 * Check whether a product matches
 * a product type preference.
 */
function matchesProductType(
    product: Product,
    productType: string
): boolean {

    const searchableText = [

        product.name,

        product.description,

        product.category,

    ]
        .join(" ")
        .toLowerCase();


    return searchableText.includes(
        productType.toLowerCase()
    );

}


/*
 * Check whether a product matches
 * a brand preference.
 */
function matchesBrand(
    product: Product,
    brand: string
): boolean {

    return product.brand
        .toLowerCase()
        .includes(
            brand.toLowerCase()
        );

}


/*
 * Check whether a product matches
 * a color preference.
 *
 * Your current Product interface has
 * an optional color field, so we only
 * use it when available.
 */
function matchesColor(
    product: Product,
    color: string
): boolean {

    const productColor =
        product.color ||
        "";

    const searchableText = [

        product.name,

        product.description,

        productColor,

    ]
        .join(" ")
        .toLowerCase();


    return searchableText.includes(
        color.toLowerCase()
    );

}


/*
 * Determine whether a product is
 * appropriate for the requested style.
 *
 * This is intentionally scoring-based
 * rather than a hard filter because
 * your current catalog does not have a
 * dedicated style field.
 */
function matchesStyle(
    product: Product,
    style: string
): boolean {

    const searchableText = [

        product.name,

        product.description,

        product.category,

        product.brand,

    ]
        .join(" ")
        .toLowerCase();


    const styleTerms =
        style
            .toLowerCase()
            .split(/[\s,.-]+/)
            .filter(
                (term) =>
                    term.length > 2
            );


    return styleTerms.some(
        (term) =>
            searchableText.includes(
                term
            )
    );

}


/*
 * Determine whether a product is
 * appropriate for the requested occasion.
 *
 * Occasion is currently used as a
 * relevance signal because the Product
 * model does not contain an occasion field.
 */
function getOccasionScore(
    product: Product,
    occasion: string
): number {

    const request =
        occasion.toLowerCase();

    const productName =
        product.name.toLowerCase();

    const category =
        product.category.toLowerCase();


    let score = 0;


    /*
     * Interview / business occasions.
     */

    if (
        request.includes("interview") ||
        request.includes("business") ||
        request.includes("professional") ||
        request.includes("formal")
    ) {

        if (
            category === "shoes"
        ) {

            if (
                productName.includes(
                    "loafer"
                )
            ) {

                score += 8;

            }

            if (
                productName.includes(
                    "pump"
                )
            ) {

                score += 7;

            }

            if (
                productName.includes(
                    "chelsea"
                )
            ) {

                score += 6;

            }

            if (
                productName.includes(
                    "sneaker"
                )
            ) {

                score -= 5;

            }

        }

    }


    return score;

}


/*
 * Search products for the AI Style
 * Advisor.
 *
 * preferences are optional so the
 * existing Phase 1 callers continue
 * to work.
 */
export async function searchProductsForAI(

    customerRequest: string,

    preferences?: StylePreferences

): Promise<Product[]> {


    const products =
        await getProducts();


    const request =
        customerRequest.toLowerCase();


    /*
     * ------------------------------------------------
     * Determine requirements from the text.
     * ------------------------------------------------
     */

    const textMaxPrice =
        extractMaxPrice(request);


    const textRequestedCategory =
        getRequestedCategory(request);


    const textInterviewRequest =
        isInterviewRequest(request);


    /*
     * ------------------------------------------------
     * Determine requirements from structured
     * preferences.
     *
     * Structured preferences take priority
     * over text extraction.
     * ------------------------------------------------
     */

    const maxPrice =
        preferences?.maxPrice ??
        textMaxPrice;


    const minPrice =
        preferences?.minPrice;


    const requestedCategory =
        preferences?.category
            ? preferences.category.toLowerCase()
            : textRequestedCategory;


    const productType =
        preferences?.productType;


    const occasion =
        preferences?.occasion;


    const brand =
        preferences?.brand;


    const color =
        preferences?.color;


    const style =
        preferences?.style;


    const interviewRequest =
        Boolean(
            occasion &&
            (
                occasion
                    .toLowerCase()
                    .includes("interview") ||
                occasion
                    .toLowerCase()
                    .includes("business") ||
                occasion
                    .toLowerCase()
                    .includes("formal") ||
                occasion
                    .toLowerCase()
                    .includes("professional")
            )
        ) ||
        textInterviewRequest;


    /*
     * Log the interpreted request.
     */

    console.log(
        "Product Search Request:",
        {

            request,

            preferences,

            maxPrice,

            minPrice,

            requestedCategory,

            productType,

            occasion,

            brand,

            color,

            style,

            interviewRequest,

        }
    );


    /*
     * ------------------------------------------------
     * STEP 1
     * Apply HARD filters first.
     * ------------------------------------------------
     *
     * Explicit budget and category
     * requirements must never be violated.
     */


    let filteredProducts =
        [...products];


    /*
     * Maximum budget.
     */

    if (
        maxPrice !== undefined
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    product.price <=
                    maxPrice
            );

    }


    /*
     * Minimum budget.
     *
     * This is optional and only applies
     * when the customer actually provided
     * one.
     */

    if (
        minPrice !== undefined
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    product.price >=
                    minPrice
            );

    }


    /*
     * Requested category.
     */

    if (
        requestedCategory
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) =>
                    product.category
                        .toLowerCase() ===
                    requestedCategory
            );

    }


    /*
     * If hard filtering produced nothing,
     * return an empty result.
     *
     * This prevents GPT from recommending
     * products outside explicit budget or
     * category requirements.
     */

    if (
        filteredProducts.length === 0
    ) {

        console.log(
            "No products match the customer's hard requirements."
        );

        return [];

    }


    /*
     * ------------------------------------------------
     * STEP 2
     * Score the remaining valid products.
     * ------------------------------------------------
     */

    const terms =
        request
            .split(/[\s,.-]+/)
            .filter(
                (term) =>
                    term.length > 2
            );


    const scoredProducts:
        ProductScore[] =

        filteredProducts.map(
            (product) => {


                const searchableText = [

                    product.name,

                    product.brand,

                    product.category,

                    product.description,

                    product.color ||
                        "",

                ]
                    .join(" ")
                    .toLowerCase();


                let score = 0;


                /*
                 * General keyword matching.
                 */

                terms.forEach(
                    (term) => {

                        if (
                            searchableText.includes(
                                term
                            )
                        ) {

                            score += 1;

                        }

                    }
                );


                /*
                 * Category intent.
                 */

                if (
                    requestedCategory ===
                    "shoes"
                ) {

                    if (
                        product.category
                            .toLowerCase() ===
                        "shoes"
                    ) {

                        score += 10;

                    }

                }


                if (
                    requestedCategory ===
                    "handbags"
                ) {

                    if (
                        product.category
                            .toLowerCase() ===
                        "handbags"
                    ) {

                        score += 10;

                    }

                }


                if (
                    requestedCategory ===
                    "jewelry"
                ) {

                    if (
                        product.category
                            .toLowerCase() ===
                        "jewelry"
                    ) {

                        score += 10;

                    }

                }


                if (
                    requestedCategory ===
                    "clothing"
                ) {

                    if (
                        product.category
                            .toLowerCase() ===
                        "clothing"
                    ) {

                        score += 10;

                    }

                }


                /*
                 * Specific product intent from
                 * the customer's text.
                 */

                if (
                    hasProductIntent(
                        request,
                        product.name
                    )
                ) {

                    score += 10;

                }


                /*
                 * Structured product type.
                 */

                if (
                    hasPreference(
                        productType
                    )
                ) {

                    if (
                        matchesProductType(
                            product,
                            productType!
                        )
                    ) {

                        score += 12;

                    }

                }


                /*
                 * Structured brand preference.
                 */

                if (
                    hasPreference(
                        brand
                    )
                ) {

                    if (
                        matchesBrand(
                            product,
                            brand!
                        )
                    ) {

                        score += 12;

                    }

                }


                /*
                 * Structured color preference.
                 */

                if (
                    hasPreference(
                        color
                    )
                ) {

                    if (
                        matchesColor(
                            product,
                            color!
                        )
                    ) {

                        score += 10;

                    }

                }


                /*
                 * Structured style preference.
                 */

                if (
                    hasPreference(
                        style
                    )
                ) {

                    if (
                        matchesStyle(
                            product,
                            style!
                        )
                    ) {

                        score += 6;

                    }

                }


                /*
                 * Occasion preference.
                 *
                 * Currently interview/formal
                 * intent is the main supported
                 * occasion because your catalog
                 * does not contain an occasion
                 * attribute.
                 */

                if (
                    hasPreference(
                        occasion
                    )
                ) {

                    score +=
                        getOccasionScore(
                            product,
                            occasion!
                        );

                }


                /*
                 * Interview/formal intent from
                 * the customer's text.
                 *
                 * Prefer loafers, pumps and
                 * Chelsea boots.
                 *
                 * Avoid sneakers.
                 */

                if (
                    interviewRequest &&
                    product.category
                        .toLowerCase() ===
                    "shoes"
                ) {

                    const productName =
                        product.name
                            .toLowerCase();


                    if (
                        productName.includes(
                            "loafer"
                        )
                    ) {

                        score += 8;

                    }


                    if (
                        productName.includes(
                            "pump"
                        )
                    ) {

                        score += 7;

                    }


                    if (
                        productName.includes(
                            "chelsea"
                        )
                    ) {

                        score += 6;

                    }


                    if (
                        productName.includes(
                            "sneaker"
                        )
                    ) {

                        score -= 5;

                    }

                }


                /*
                 * Budget preference.
                 *
                 * All products already satisfy
                 * the hard maximum budget.
                 *
                 * Give a small preference to
                 * products closer to the budget.
                 */

                if (
                    maxPrice !== undefined
                ) {

                    const budgetRatio =
                        product.price /
                        maxPrice;


                    if (
                        budgetRatio >= 0.75
                    ) {

                        score += 2;

                    }

                }


                return {

                    product,

                    score,

                };

            }
        );


    /*
     * Sort by relevance.
     */

    scoredProducts.sort(
        (a, b) => {

            if (
                b.score !==
                a.score
            ) {

                return (
                    b.score -
                    a.score
                );

            }


            /*
             * When relevance is equal,
             * prefer the less expensive
             * product.
             */

            return (
                a.product.price -
                b.product.price
            );

        }
    );


    /*
     * Return at most five candidates
     * to GPT.
     */

    const results =
        scoredProducts
            .slice(
                0,
                5
            )
            .map(
                (item) =>
                    item.product
            );


    console.log(
        "Product Search Results:",
        results.map(
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


    return results;

}