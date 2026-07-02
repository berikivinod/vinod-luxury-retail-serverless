import styles from "./CategorySection.module.css";

const categories = [
  {
    name: "CLOTHING",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    name: "SHOES",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    name: "HANDBAGS",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  },
  {
    name: "JEWELRY",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
  },
  {
    name: "ACCESSORIES",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  },
];

export default function CategorySection() {
  return (
    <section className={styles.container}>
      <div className={styles.tabs}>
        {categories.map((item) => (
          <button
            key={item.name}
            className={
              item.name === "CLOTHING"
                ? `${styles.tab} ${styles.active}`
                : styles.tab
            }
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className={styles.cards}>
        {categories.map((item) => (
          <div key={item.name} className={styles.card}>
            <img src={item.image} alt={item.name} />
          </div>
        ))}
      </div>
    </section>
  );
}