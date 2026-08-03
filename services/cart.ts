import { Cart } from "@/types/cart";

const CART_API =
    process.env.NEXT_PUBLIC_CART_API;

export async function getCart(
    userId: string
): Promise<Cart> {

    const response = await fetch(
        `${CART_API}/cart?userId=${userId}`
    );

    if (!response.ok) {

        throw new Error(
            "Unable to load shopping bag."
        );

    }

    return response.json();

}

export async function addToCart(
    userId: string,
    productId: number,
    quantity: number
): Promise<Cart> {

    const response = await fetch(
        `${CART_API}/cart`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({

                userId,

                productId,

                quantity,

            }),

        }
    );

    if (!response.ok) {

        throw new Error(
            "Unable to add item to bag."
        );

    }

    return response.json();

}

export async function updateCartItem(
    userId: string,
    productId: number,
    quantity: number
): Promise<Cart> {

    const response = await fetch(
        `${CART_API}/cart`,
        {

            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({

                userId,

                productId,

                quantity,

            }),

        }
    );

    if (!response.ok) {

        throw new Error(
            "Unable to update bag."
        );

    }

    return response.json();

}

export async function removeCartItem(
    userId: string,
    productId: number
): Promise<Cart> {

    const response = await fetch(
        `${CART_API}/cart`,
        {

            method: "DELETE",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({

                userId,

                productId,

            }),

        }
    );

    if (!response.ok) {

        throw new Error(
            "Unable to remove item."
        );

    }

    return response.json();

}