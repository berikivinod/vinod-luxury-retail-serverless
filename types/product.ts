export interface Product {

    id: number;

    sku?: string;

    name: string;

    brand: string;

    description: string;

    category: string;

    image: string;

    price: number;

    originalPrice?: number;

    color?: string;

    size?: string;

    quantity?: number;

    inStock?: boolean;

    rating?: number;

    reviewCount?: number;

    isNew?: boolean;

    isSale?: boolean;

}