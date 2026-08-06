export interface PlaceOrderResponse {

    orderId: string;

    orderDate: string;

    status: string;

    total: number;

}

export async function placeOrder(
    userId: string
): Promise<PlaceOrderResponse> {

    const response = await fetch(

        `${process.env.NEXT_PUBLIC_PRODUCTS_API}/orders`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                userId,

            }),

        }

    );

    if (!response.ok) {

        throw new Error(
            "Unable to place order."
        );

    }

    return response.json();

}