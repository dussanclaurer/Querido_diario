import Link from "next/link";
import styles from "./DiaryCard.module.css";

type Entry = {
  id: string;
  userId: string;
  description: string | null;
  createdAt: Date | null;
  photos: { id: string; url: string }[];
};

export function DiaryCard({ entry }: { entry: Entry }) {
  const date = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const cover = entry.photos[0];
  const extra = entry.photos.length - 1;

  return (
    <Link href={`/diary/${entry.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {cover ? (
          <img
            src={cover.url}
            alt={entry.description || "Entrada del diario"}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage} />
        )}
        {extra > 0 && <span className={styles.badge}>+{extra}</span>}
      </div>
      <div className={styles.info}>
        <time className={styles.date}>{date}</time>
        {entry.description && (
          <p className={styles.desc}>{entry.description}</p>
        )}
      </div>
    </Link>
  );
}
