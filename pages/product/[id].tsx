import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import Image from "next/image";

import useFavorites from "@/hooks/useFavorites";

import RecentlyViewed
    from "@/components/Product/RecentlyViewed";

import { Product } from "@/types/product";

import { getProductById } from "@/services/products";
import { addToCart } from "@/services/cart";

import styles from "@/styles/PDP.module.css";

export default function ProductDetail() {

    const router = useRouter();

    const { id } = router.query;

    // Will be replaced with AuthContext in a later refactor
    const [user, setUser] =
        useState<any>(null);

    const [product, setProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] =
        useState(true);

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorites();

    useEffect(() => {

        if (!id || Array.isArray(id)) {
        return;
    }

        const loadProduct = async () => {

            try {

                setLoading(true);

                const data =
                    await getProductById(id);

                setProduct(data);

            } catch (error) {

                console.error(
                    "Failed to load product",
                    error
                );

                setProduct(null);

            } finally {

                setLoading(false);

            }

        };

        loadProduct();

    }, [id]);

    useEffect(() => {

        if (!product) {
            return;
        }

        const existing: Product[] =
            JSON.parse(
                localStorage.getItem(
                    "recentlyViewed"
                ) || "[]"
            );

        const filtered =
            existing.filter(
                (p: Product) =>
                    p.id !== product.id
            );

        filtered.unshift(product);

        localStorage.setItem(
            "recentlyViewed",
            JSON.stringify(
                filtered.slice(0, 8)
            )
        );

    }, [product]);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

    }, []);

    if (loading) {

        return (
            <>
                <Header />

                <div
                    style={{
                        padding: "40px",
                        textAlign: "center",
                    }}
                >
                    Loading Product...
                </div>

                <Footer />
            </>
        );

    }

    if (!product) {

        return (
            <>
                <Header />

                <div className={styles.notFound}>
                    Product Not Found
                </div>

                <Footer />
            </>
        );

    }

    const handleAddToBag = async () => {

    if (!user) {

        alert(
            "Please sign in to add items to your bag."
        );

        return;

    }

    try {

        await addToCart(

            String(user.id),

            product.id,

            1

        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        alert("Added to Bag");

    } catch (error) {

        console.error(error);

        alert(
            "Unable to add item to cart."
        );

    }

};

    return (

        <>
            <Header />

            <div className={styles.wrapper}>

                <div className={styles.imageSection}>

                    <Image
                        src={
                            product.image ||
                            "/images/products/placeholder-product.jpg"
                        }
                        alt={product.name}
                        width={600}
                        height={700}
                        className={styles.productImage}
                    />

                </div>

                <div className={styles.infoSection}>

                    <div className={styles.brand}>
                        {product.brand}
                    </div>

                    <h1>{product.name}</h1>

                    <div className={styles.price}>
                        $
                        {product.price.toLocaleString()}
                    </div>

                    <div className={styles.description}>
                        {product.description}
                    </div>

                    <div className={styles.category}>
                        Category: {product.category}
                    </div>

                    <button
                        className={styles.addToBag}
                        onClick={handleAddToBag}
                    >
                        ADD TO BAG
                    </button>

                    <button
                        className={styles.addToFavorites}
                        onClick={() =>
                            toggleFavorite(
                                product.id
                            )
                        }
                    >
                        {favoriteIds.has(product.id)
                            ? "REMOVE FROM FAVORITES"
                            : "ADD TO FAVORITES"}
                    </button>

                </div>

            </div>

            <RecentlyViewed />

            <Footer />

        </>

    );

}