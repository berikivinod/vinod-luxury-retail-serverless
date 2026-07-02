import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./RecentlyViewed.module.css";

export default function RecentlyViewed() {
  const [products, setProducts] =
    useState<any[]>([]);

  useEffect(() => {
    const viewed =
      JSON.parse(
        localStorage.getItem(
          "recentlyViewed"
        ) || "[]"
      );

    setProducts(viewed);
  }, []);

  if (products.length === 0)
    return null;

  return (
    <div className={styles.container}>
      <h2>
        Recently Viewed
      </h2>

      <div className={styles.grid}>
        {products.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}
      </div>
    </div>
  );
}