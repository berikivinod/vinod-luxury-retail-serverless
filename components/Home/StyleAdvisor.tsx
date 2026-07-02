import styles from "./StyleAdvisor.module.css";

export default function StyleAdvisor() {
  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <h2>
          SHOPPING,
          <br />
          PERSONALIZED
        </h2>
      </div>

      <div className={styles.center}>
        <p>
          From wardrobe advice to tracking down a specific item,
          our Style Advisors are ready to assist you.
        </p>
      </div>

      <div className={styles.right}>
        <a href="/c/cat78570743">
          MEET YOUR STYLE ADVISOR
        </a>
      </div>
    </section>
  );
}