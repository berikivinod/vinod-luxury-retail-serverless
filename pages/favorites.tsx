import { useRouter } from "next/router";

import AccountLayout from "@/components/Account/AccountLayout";

import useAuth from "@/hooks/useAuth";
import useFavorites from "@/hooks/useFavorites";

import styles from "@/styles/favorites.module.css";

export default function Favorites() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const {
        favorites,
        loading: favoritesLoading,
        toggleFavorite,
    } = useFavorites();

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

    return (

        <AccountLayout activePage="favorites">

            <div className={styles.content}>

                <h1>Favorites</h1>

                {favoritesLoading ? (

                    <div
                        style={{
                            padding: "80px",
                            textAlign: "center",
                            fontSize: "22px",
                        }}
                    >
                        Loading your favorites...
                    </div>

                ) : favorites.length === 0 ? (

                    <div className={styles.emptyState}>

                        <h3>
                            No favorites yet
                        </h3>

                        <p>
                            You currently have no favorite items.
                            Browse products and click the heart icon
                            to save them here.
                        </p>

                    </div>

                ) : (

                    <div className={styles.productsGrid}>

                        {favorites.map((product: any) => (

                            <div
                                key={product.id}
                                className={styles.favoriteCard}
                                onClick={() =>
                                    router.push(
                                        `/product/${product.id}`
                                    )
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

        </AccountLayout>

    );

}