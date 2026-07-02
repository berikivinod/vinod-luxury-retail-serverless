import styles from "./WhereToWear.module.css";

const occasions = [
  {
    title: "GARDEN PARTY",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
  },
  {
    title: "WEDDING",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    title: "WORK",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    title: "VACATION",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae",
  },
  {
    title: "WEEKEND",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
];

export default function WhereToWear() {
  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>WHERE TO WEAR</h2>

      <div className={styles.cards}>
        {occasions.map((item) => (
          <div key={item.title} className={styles.card}>
            <img src={item.image} alt={item.title} />

            <div className={styles.label}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}