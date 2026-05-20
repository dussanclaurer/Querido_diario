"use client";

import { useState } from "react";
import styles from "./PhotoGallery.module.css";

type Photo = { id: string; url: string };

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState(0);

  if (!photos.length) {
    return <div className={styles.empty}>Sin fotos</div>;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img src={photos[selected].url} alt="" className={styles.mainImg} />
      </div>
      {photos.length > 1 && (
        <div className={styles.thumbs}>
          {photos.map((p, i) => (
            <button
              key={p.id}
              className={`${styles.thumb} ${i === selected ? styles.thumbActive : ""}`}
              onClick={() => setSelected(i)}
            >
              <img src={p.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
