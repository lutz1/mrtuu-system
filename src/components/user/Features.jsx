import { useState } from "react";
import { IconCheck } from "./icons";
import styles from "./Features.module.css";

const FEATURES_PREVIEW_COUNT = 4;

export default function Features({ features }) {
  const [showAll, setShowAll] = useState(false);
  const visibleFeatures = showAll ? features : features.slice(0, FEATURES_PREVIEW_COUNT);

  return (
    <div className={styles.featuresSection}>
      <h2 className={styles.sectionHeading}>Features</h2>
      <ul className={styles.featuresList}>
        {visibleFeatures.map((feature) => (
          <li key={feature} className={styles.featureItem}>
            <IconCheck className={styles.featureIcon} />
            {feature}
          </li>
        ))}
      </ul>
      {features.length > FEATURES_PREVIEW_COUNT && (
        <button type="button" className={styles.showMoreBtn} onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}