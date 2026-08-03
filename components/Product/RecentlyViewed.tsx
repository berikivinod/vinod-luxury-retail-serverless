import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import { Product } from "@/types/product";

import styles from "./RecentlyViewed.module.css";

export default function RecentlyViewed() {

    const [products, setProducts] =
        useState<Product[]>([]);

    useEffect(() => {

        const viewed: Product[] =
            JSON.parse(
                localStorage.getItem(
                    "recentlyViewed"
                ) || "[]"
            );

        setProducts(viewed);

    }, []);

    if (products.length === 0) {
        return null;
    }

    return (

        <div className={styles.container}>

            <h2>
                Recently Viewed
            </h2>

            <div className={styles.grid}>

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                    />

                ))}

            </div>

        </div>

    );

}