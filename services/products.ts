import { Product } from "@/types/product";

const PRODUCTS_API =
    process.env.NEXT_PUBLIC_PRODUCTS_API;

export async function getProducts(): Promise<Product[]> {

    const response = await fetch(
        `${PRODUCTS_API}/products`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load products."
        );
    }

    return response.json();

}

export async function getProductById(
    id: number | string
): Promise<Product> {

    const response = await fetch(
        `${PRODUCTS_API}/products/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load product."
        );
    }

    return response.json();

}