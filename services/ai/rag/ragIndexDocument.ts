export interface RAGIndexDocument {

    productId: number;

    sku?: string;

    name: string;

    brand: string;

    category: string;

    price: number;

    image?: string;

    description?: string;

    embedding: number[];

    searchableText: string;

    metadata: {

        color?: string;

        size?: string;

        gender?: string;

        occasion?: string[];

        material?: string[];

        style?: string[];

        inStock?: boolean;

        isNew?: boolean;

        isSale?: boolean;

    };

}