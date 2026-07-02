import { useState } from "react";
import styles from "./ThingsWeLove.module.css";

const products = [
  {
    brand: "Gucci",
    name: "Luxury Leather Handbag",
    price: "$2,450",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  },
  {
    brand: "Prada",
    name: "Designer Sunglasses",
    price: "$890",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
  },
  {
    brand: "Dior",
    name: "Premium Fragrance",
    price: "$180",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
  },
  {
    brand: "Rolex",
    name: "Luxury Watch",
    price: "$12,000",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  },
  {
    brand: "Louis Vuitton",
    name: "Travel Collection",
    price: "$3,900",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
  },
];

export default function ThingsWeLove() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleProducts = products.slice(
    startIndex,
    startIndex + 4
  );

  const next = () => {
    if (startIndex < products.length - 4) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>THINGS WE LOVE</h2>

      <div className={styles.carouselWrapper}>
        <button
          className={styles.navButton}
          onClick={prev}
        >
          ❮
        </button>

        <div className={styles.products}>
          {visibleProducts.map((product) => (
            <div
              key={product.name}
              className={styles.card}
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <h4>{product.brand}</h4>

              <p>{product.name}</p>

              <span>{product.price}</span>
            </div>
          ))}
        </div>

        <button
          className={styles.navButton}
          onClick={next}
        >
          ❯
        </button>
      </div>
    </section>
  );
}