import { useEffect, useState } from "react";
import styles from "./HeroCarousel.module.css";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    title: "Summer Luxury Collection",
    description: "Discover designer styles curated for modern elegance.",
    buttonText: "SHOP NOW",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    title: "Exclusive Accessories",
    description: "Handbags, jewelry and accessories from world-class designers.",
    buttonText: "EXPLORE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    title: "New Designer Arrivals",
    description: "Fresh collections from the most sought-after brands.",
    buttonText: "VIEW COLLECTION",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    title: "Luxury Shopping Experience",
    description: "Elevate your style with premium fashion and beauty.",
    buttonText: "DISCOVER",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [hovered]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section
      className={styles.carousel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={slides[current].image}
        alt={slides[current].title}
        className={styles.image}
      />

      <div className={styles.overlay}>
        <h2>{slides[current].title}</h2>
        <p>{slides[current].description}</p>
        <button>{slides[current].buttonText}</button>
      </div>

      {hovered && (
        <>
          <button
            className={`${styles.arrow} ${styles.left}`}
            onClick={prevSlide}
          >
            ❮
          </button>

          <button
            className={`${styles.arrow} ${styles.right}`}
            onClick={nextSlide}
          >
            ❯
          </button>
        </>
      )}

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={
              index === current
                ? `${styles.dot} ${styles.active}`
                : styles.dot
            }
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}