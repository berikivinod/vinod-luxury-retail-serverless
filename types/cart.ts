import { Product } from "./product";

export interface CartItem extends Product {

    productId: number;

    quantity: number;

}

export interface Cart {

    userId: string;

    items: CartItem[];

}