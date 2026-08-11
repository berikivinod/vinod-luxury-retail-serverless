import { Product } from "@/types/product";

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

export async function searchProductsForAI(

    customerRequest: string

): Promise<Product[]> {

    const products =
        await getProducts();

    const request =
        customerRequest.toLowerCase();

    const maxPrice =
        extractMaxPrice(request);

    const requestedCategory =
        getRequestedCategory(request);

    const interviewRequest =
        isInterviewRequest(request);

    /*
     * Log the interpreted request.
     *
     * Useful while testing the AI.
     */

    console.log(
        "Product Search Request:",
        {
            request,
            maxPrice,
            requestedCategory,
            interviewRequest,
        }
    );

    /*
     * ------------------------------------------------
     * STEP 1
     * Apply HARD filters first.
     * ------------------------------------------------
     *
     * If the customer specifies a budget,
     * NEVER send products above that budget
     * to GPT.
     */

    let filteredProducts =
        [...products];

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
     * If the customer clearly requested
     * a category, only search that category.
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
     * products outside the customer's
     * explicit requirements.
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
                 * Specific product intent.
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
                 * Interview/formal intent.
                 *
                 * Prefer loafers, pumps and
                 * Chelsea boots for interviews.
                 *
                 * Avoid sneakers for formal
                 * interview requests.
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
                 * At this point all products
                 * already satisfy the hard
                 * budget requirement.
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
            .slice(0, 5)
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