import { Product } from "./product";

export interface CartItem {

    productId: number;

    quantity: number;

    name: string;

    brand: string;

    image: string;

    price: number;

    category: string;

}

export interface Cart {

    userId: string;

    items: CartItem[];

}