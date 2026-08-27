import { useAuth } from "../../context/AuthContext";
import styles from "./PageHero.module.css";

export default function PageHero({ eyebrow, title, subtitle, image }) {
  const { isLoggedIn } = useAuth();

  return (
    <section
      className={`${styles.hero} ${isLoggedIn ? styles.heroThemed : ""}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}