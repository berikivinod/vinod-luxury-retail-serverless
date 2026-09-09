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

    /*
     * Current structured product-type
     * preference match.
     *
     * This is used as a higher-priority
     * ranking signal than the numerical
     * score.
     */
    productTypeMatch: boolean;

}


/*
 * Extract maximum price from the
 * customer's request.
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
 * Determine whether the customer
 * is looking for shoes.
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
 * Determine whether the customer
 * is looking for handbags.
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
 * Determine whether the customer
 * is looking for jewelry.
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
 * Determine whether the customer
 * is looking for clothing.
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
 * Get requested category.
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
 * Determine product intent from
 * conversation text.
 *
 * IMPORTANT:
 *
 * This is only used when there is no
 * current structured productType.
 *
 * Once structured productType exists,
 * it becomes the source of truth.
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
 * Check whether a preference
 * has a meaningful value.
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
 * the requested product type.
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
 * the requested brand.
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
 * the requested color.
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
 * Check whether a product matches
 * the requested style.
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
 * Calculate occasion relevance.
 *
 * Occasion is a relevance signal because
 * the Product model does not have a
 * dedicated occasion field.
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
     * Interview / business / formal
     * occasions.
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
 * Get specific products by their IDs.
 *
 * Used by COMPARE intent so that the AI
 * compares only products that were already
 * shown to the customer.
 */
export async function getProductsByIds(
    productIds: number[]
): Promise<Product[]> {

    if (
        !productIds ||
        productIds.length === 0
    ) {
        return [];
    }

    const products =
        await getProducts();

    const requestedIds =
        new Set(productIds);

    const matchedProducts =
        products.filter(
            (product) =>
                requestedIds.has(product.id)
        );

    console.log(
        "Products Loaded For Comparison:",
        matchedProducts.map(
            (product) => ({
                id: product.id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                price: product.price,
            })
        )
    );

    return matchedProducts;
}


/*
 * Search products for the AI
 * Style Advisor.
 *
 * Structured preferences are optional
 * so existing callers continue to work.
 */

export async function searchProductsForAI(

    customerRequest: string,

    preferences?: StylePreferences,

    excludeProductIds: number[] = []

): Promise<Product[]> {


    const products =
        await getProducts();


    const request =
        customerRequest.toLowerCase();


    /*
     * ----------------------------------------
     * Text-derived requirements
     * ----------------------------------------
     */

    const textMaxPrice =
        extractMaxPrice(request);


    const textRequestedCategory =
        getRequestedCategory(request);


    const textInterviewRequest =
        isInterviewRequest(request);


    /*
     * ----------------------------------------
     * Structured preferences
     *
     * Structured preferences take priority
     * over text extraction.
     * ----------------------------------------
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
     * Log interpreted requirements.
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
     * ----------------------------------------
     * STEP 1
     * HARD FILTERS
     * ----------------------------------------
     *
     * Explicit category and budget
     * requirements must never be violated.
     */

    let filteredProducts =
        [...products];

    /*
 * Exclude products that were already
 * shown to the customer.
 */

if (excludeProductIds.length > 0) {

    filteredProducts =
        filteredProducts.filter(
            (product) =>
                !excludeProductIds.includes(
                    product.id
                )
        );

}
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
     * Category.
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
     * No valid products.
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
     * ----------------------------------------
     * STEP 2
     * SCORE PRODUCTS
     * ----------------------------------------
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
                 * ------------------------------------
                 * GENERAL KEYWORD MATCH
                 * ------------------------------------
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
                 * ------------------------------------
                 * CATEGORY MATCH
                 * ------------------------------------
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
                 * ------------------------------------
                 * CURRENT STRUCTURED PRODUCT TYPE
                 * ------------------------------------
                 *
                 * This is the strongest preference
                 * signal.
                 */

                let currentProductTypeMatch =
                    false;


                if (

                    hasPreference(
                        productType
                    )

                ) {

                    currentProductTypeMatch =

                        matchesProductType(

                            product,

                            productType!

                        );


                    if (

                        currentProductTypeMatch

                    ) {

                        score += 20;

                    } else {

                        /*
                         * Product type is a preference,
                         * not a hard requirement.
                         */

                        score -= 8;

                    }

                } else {

                    /*
                     * --------------------------------
                     * TEXT PRODUCT INTENT
                     * --------------------------------
                     *
                     * Only use historical text
                     * product intent when there is
                     * no current structured type.
                     */

                    if (

                        hasProductIntent(

                            request,

                            product.name

                        )

                    ) {

                        score += 10;

                    }

                }


                /*
                 * ------------------------------------
                 * BRAND PREFERENCE
                 * ------------------------------------
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

                        score += 15;

                    } else {

                        score -= 5;

                    }

                }


                /*
                 * ------------------------------------
                 * COLOR PREFERENCE
                 * ------------------------------------
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

                        score += 12;

                    } else {

                        score -= 4;

                    }

                }


                /*
                 * ------------------------------------
                 * STYLE PREFERENCE
                 * ------------------------------------
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

                        score += 8;

                    } else {

                        score -= 2;

                    }

                }


                /*
                 * ------------------------------------
                 * OCCASION
                 * ------------------------------------
                 *
                 * Apply occasion scoring only once.
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
                 * ------------------------------------
                 * TEXT INTERVIEW FALLBACK
                 * ------------------------------------
                 */

                if (

                    !hasPreference(
                        occasion
                    ) &&

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
                 * ------------------------------------
                 * BUDGET PROXIMITY
                 * ------------------------------------
                 */

                if (

                    maxPrice !== undefined

                ) {

                    const budgetRatio =

                        product.price /
                        maxPrice;


                    if (

                        budgetRatio >= 0.90

                    ) {

                        score += 4;

                    } else if (

                        budgetRatio >= 0.75

                    ) {

                        score += 2;

                    }

                }


                return {

                    product,

                    score,

                    productTypeMatch:
                        currentProductTypeMatch,

                };

            }

        );


    /*
     * ----------------------------------------
     * STEP 3
     * RELEVANCE SORTING
     * ----------------------------------------
     *
     * IMPORTANT:
     *
     * Current structured product type
     * takes priority over the numerical
     * score.
     *
     * This prevents stale conversation
     * terms from defeating the customer's
     * latest preference.
     */

    scoredProducts.sort(

        (a, b) => {


            /*
             * If a current productType
             * preference exists, matching
             * products always come first.
             */

            if (

                hasPreference(
                    productType
                ) &&

                a.productTypeMatch !==
                b.productTypeMatch

            ) {

                return a.productTypeMatch

                    ? -1

                    : 1;

            }


            /*
             * Once the current product type
             * has been honored, compare
             * normal relevance scores.
             */

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
             * Final tie-breaker:
             * lower price first.
             */

            return (

                a.product.price -
                b.product.price

            );

        }

    );


    /*
     * ----------------------------------------
     * DEBUG PRODUCT RANKING
     * ----------------------------------------
     */

    console.log(

        "Product Ranking:",

        scoredProducts.map(

            (item) => ({

                id:
                    item.product.id,

                name:
                    item.product.name,

                price:
                    item.product.price,

                score:
                    item.score,

                productTypeMatch:
                    item.productTypeMatch,

            })

        )

    );


    /*
     * ----------------------------------------
     * STEP 4
     * RETURN TOP CANDIDATES
     * ----------------------------------------
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