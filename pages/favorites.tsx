import styles from "@/styles/favorites.module.css";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Favorites() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    const [favorites, setFavorites] =
        useState<any[]>([]);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        setUser(currentUser);

        const storedFavorites =
            localStorage.getItem(
                `favorites_${currentUser.id}`
            );

        if (storedFavorites) {
            setFavorites(
                JSON.parse(storedFavorites)
            );
        }

    }, [router]);

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