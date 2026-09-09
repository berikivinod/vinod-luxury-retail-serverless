import type { Product } from "@/types/product";

export interface RAGProductDocument {

    productId: number;

    sku?: string;

    name: string;

    brand: string;

    category: string;

    price: number;

    searchableText: string;

    metadata: {

        productType?: string;

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


export function buildRAGProductDocument(
    product: Product
): RAGProductDocument {

    const searchableParts = [

    product.name,

    product.brand,

    product.category,

    product.productType,

    product.description,

    product.color,

    product.size,

    product.gender,

    ...(product.occasion || []),

    ...(product.material || []),

    ...(product.style || []),

];

    const searchableText =
        searchableParts
            .filter(Boolean)
            .join(". ");

    return {

        productId:
            product.id,

        sku:
            product.sku,

        name:
            product.name,

        brand:
            product.brand,

        category:
            product.category,

        price:
            product.price,

        searchableText,

        metadata: {

    productType:
        product.productType,

    color:
        product.color,

    size:
        product.size,

    gender:
        product.gender,

    occasion:
        product.occasion,

    material:
        product.material,

    style:
        product.style,

    inStock:
        product.inStock,

    isNew:
        product.isNew,

    isSale:
        product.isSale,

},

    };

}