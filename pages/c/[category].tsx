import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import ProductCard from "@/components/Product/ProductCard";

import useFavorites from "@/hooks/useFavorites";

import { Product } from "@/types/product";

import { getProducts } from "@/services/products";

import styles from "@/styles/PLP.module.css";

export default function CategoryPage() {

    const router = useRouter();

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorites();

    const { category } = router.query;

    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!category) {
            return;
        }

        const loadProducts = async () => {

            try {

                setLoading(true);

                const data =
                    await getProducts();

                const filtered =
                    data.filter(
                        (product: Product) =>
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
                            isFavorite={
                                favoriteIds.has(product.id)
                            }
                            onFavoriteToggle={
                                toggleFavorite
                            }
                        />

                    ))}

                </div>

            </div>

            <Footer />

        </>

    );

}