import Link from "next/link";
import Image from "next/image";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: {
    id: number;
    brand: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
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
          ${product.price.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}