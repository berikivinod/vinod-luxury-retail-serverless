import Link from "next/link";
import Image from "next/image";
import {
    FaHeart,
    FaRegHeart
} from "react-icons/fa";

import { Product } from "@/types/product";

import styles from "./ProductCard.module.css";

interface ProductCardProps {

    product: Product;

    isFavorite?: boolean;

    onFavoriteToggle?: (
        productId: number
    ) => void | Promise<void>;

}

export default function ProductCard({

    product,

    isFavorite = false,

    onFavoriteToggle,

}: ProductCardProps) {

    return (

        <Link
            href={`/product/${product.id}`}
            className={styles.card}
        >

            <div className={styles.imageContainer}>

                <button
                    className={styles.favoriteButton}
                    onClick={(e) => {

                        e.preventDefault();

                        e.stopPropagation();

                        console.log(
                            "Heart clicked",
                            product.id
                        );

                        console.log(
                            "onFavoriteToggle =",
                            onFavoriteToggle
                        );

                        onFavoriteToggle?.(
                            product.id
                        );

                    }}
                >

                    {isFavorite ? (

                        <FaHeart
                            className={
                                styles.favoriteFilled
                            }
                        />

                    ) : (

                        <FaRegHeart
                            className={
                                styles.favoriteOutline
                            }
                        />

                    )}

                </button>

                <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={380}
                    className={styles.image}
                />

            </div>

            <div className={styles.content}>

                <div className={styles.brand}>
                    {product.brand}
                </div>

                <div className={styles.name}>
                    {product.name}
                </div>

                <div className={styles.price}>
                    $
                    {product.price.toLocaleString()}
                </div>

            </div>

        </Link>

    );

}