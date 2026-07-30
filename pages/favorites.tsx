import styles from "@/styles/favorites.module.css";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useFavorites from "@/hooks/useFavorites";
export default function Favorites() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    const {
    favorites,
    loading,
    toggleFavorite,
} = useFavorites();

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        setUser(JSON.parse(storedUser));

    }, [router]);

    if (loading) {
    return (
        <>
            <Header />
            <div className={styles.content}>
                Loading favorites...
            </div>
            <Footer />
        </>
    );
}

    if (!user) return null;
    return (
        <>
            <Header />
            <div className={styles.wrapper}>
                <AccountSidebar
                    user={user}
                    activePage="favorites"
                />
                <div className={styles.content}>
                    <h1>Favorites</h1>

                    {favorites.length === 0 ? (
                        <div className={styles.emptyState}>
                            You currently have no favorited items.
                            You can add favorites from any product page.
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {favorites.map((product: any) => (
                                <div
    key={product.id}
    className={styles.favoriteCard}
    onClick={() =>
        router.push(`/product/${product.id}`)
    }
>
                                    <img
                                        src={
                                            product.image ||
                                            "/images/products/placeholder-product.jpg"
                                        }
                                        alt={product.name}
                                        className={styles.favoriteImage}
                                    />

                                    <div className={styles.favoriteBrand}>
                                        {product.brand}
                                    </div>

                                    <div className={styles.favoriteName}>
                                        {product.name}
                                    </div>

                                    <div className={styles.favoritePrice}>
                                        $
                                        {product.price.toLocaleString()}
                                    </div>
                                    <button
    className={styles.removeButton}
    onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(product.id);
    }}
>
    Remove
</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}