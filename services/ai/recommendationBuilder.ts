import type {
    AIRecommendation,
} from "@/types/ai";


export interface RecommendationProduct {

    id: number;

    name: string;

    brand: string;

    category: string;

    price: number;

    image: string;

}


export interface RecommendationReason {

    productId: number;

    reason: string;

}


export function buildRecommendations(

    productIds: number[],

    reasons: RecommendationReason[],

    products: RecommendationProduct[]

): AIRecommendation[] {

    return productIds

        .map(

            (productId) => {

                const product =
                    products.find(

                        (item) =>
                            item.id ===
                            productId

                    );


                /*
                 * Never create a recommendation
                 * for a product that does not exist
                 * in the catalog.
                 */

                if (!product) {

                    return null;

                }


                const reason =
                    reasons.find(

                        (item) =>
                            item.productId ===
                            productId

                    );


                return {

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
                        reason?.reason ||
                        "A strong match for your request.",

                };

            }

        )

        .filter(

            (
                item
            ): item is AIRecommendation =>

                item !== null

        )

        .slice(

            0,

            3

        );

}