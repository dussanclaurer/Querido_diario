import Link from "next/link";
import styles from "./DiaryCard.module.css";

type Entry = {
  id: string;
  userId: string;
  imageUrl: string;
  description: string | null;
  createdAt: Date | null;
};

export function DiaryCard({ entry }: { entry: Entry }) {
  const date = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link href={`/diary/${entry.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={entry.imageUrl}
          alt={entry.description || "Entrada del diario"}
          className={styles.image}
          loading="lazy"
        />
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
