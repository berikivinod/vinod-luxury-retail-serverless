import { useRouter } from "next/router";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";

import useAuth from "@/hooks/useAuth";
import useFavorites from "@/hooks/useFavorites";

import styles from "@/styles/favorites.module.css";

export default function Favorites() {

    const router = useRouter();

    const { user, loading: authLoading } = useAuth();

    const {
        favorites,
        loading: favoritesLoading,
        toggleFavorite,
    } = useFavorites();

    if (authLoading) {

        return (
            <>
                <Header />

                <div
                    className={styles.content}
                    style={{
                        padding: "80px",
                        textAlign: "center",
                        fontSize: "22px",
                    }}
                >
                    Loading your account...
                </div>

                <Footer />
            </>
        );

    }

    if (!user) {
        return null;
    }

    if (favoritesLoading) {

        return (
            <>
                <Header />

                <div
                    className={styles.content}
                    style={{
                        padding: "80px",
                        textAlign: "center",
                        fontSize: "22px",
                    }}
                >
                    Loading your favorites...
                </div>

                <Footer />
            </>
        );

    }

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