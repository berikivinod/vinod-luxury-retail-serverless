import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import ProductCard from "@/components/Product/ProductCard";
import styles from "@/styles/Search.module.css";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const query =
    typeof router.query.q === "string"
      ? router.query.q.toLowerCase()
      : "";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCTS_API}/products`
        );

        const data =
          await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts =
    products.filter(
      (product: any) =>
        product.name
          .toLowerCase()
          .includes(query) ||

        product.brand
          .toLowerCase()
          .includes(query) ||

        product.category
          .toLowerCase()
          .includes(query)
    );

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
        <h1>
          Search Results
        </h1>

        <p>
          {filteredProducts.length} products found
        </p>

        <div className={styles.grid}>
          {filteredProducts.map(
            (product: any) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}