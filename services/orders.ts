import { Order } from "@/types/order";

const PRODUCTS_API =
    process.env.NEXT_PUBLIC_PRODUCTS_API;

export async function getOrders(
    userId: string
): Promise<Order[]> {

    const response = await fetch(
        `${PRODUCTS_API}/orders?userId=${userId}`
    );

    if (!response.ok) {

        throw new Error(
            "Unable to load orders."
        );

    }

    return response.json();

}

export async function getOrderById(
    orderId: string
): Promise<Order> {

    const response = await fetch(
        `${PRODUCTS_API}/orders/${orderId}`
    );

    if (!response.ok) {

        throw new Error(
            "Order not found."
        );

    }

    return response.json();

}