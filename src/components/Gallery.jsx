import React, { useState } from "react";
import styles from "./Gallery.module.css";

export default function Gallery({ images, carName }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <img src={activeImage} alt={carName} className={styles.galleryMainImage} />
      </div>
      <div className={styles.galleryThumbs}>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={i}
            type="button"
            className={styles.galleryThumbBtn}
            onClick={() => setActiveImage(img)}
          >
            <img src={img} alt={`${carName} view ${i + 2}`} className={styles.galleryThumbImage} />
          </button>
        ))}
      </div>
    </div>
  );
}