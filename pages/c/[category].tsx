import { useRouter } from "next/router";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import ProductCard from "@/components/Product/ProductCard";
import { useEffect, useState } from "react";

import styles from "@/styles/PLP.module.css";

export default function CategoryPage() {
  const router = useRouter();

  const { category } = router.query;
  const [products, setProducts] =
  useState<any[]>([]);

const [loading, setLoading] =
  useState(true);

  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() ===
      String(category).toLowerCase()
  );

  useEffect(() => {
  if (!category) return;

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCTS_API}/products`
      );

      const data = await response.json();

      const filtered =
        data.filter(
          (product: any) =>
            product.category.toLowerCase() ===
            String(category).toLowerCase()
        );

      setProducts(filtered);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [category]);

if (loading) {
  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        Loading Products...
      </div>

      <Footer />
    </>
  );
}

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <h1>{category}</h1>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}