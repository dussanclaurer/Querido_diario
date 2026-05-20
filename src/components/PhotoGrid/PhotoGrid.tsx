import { DiaryCard } from "../DiaryCard/DiaryCard";
import styles from "./PhotoGrid.module.css";

type Entry = {
  id: string;
  userId: string;
  description: string | null;
  createdAt: Date | null;
  photos: { id: string; url: string }[];
  authorName: string;
  authorAvatar: string | null;
};

export function PhotoGrid({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Todavía no hay entradas en el diario.</p>
        <p className={styles.emptySub}>¡Sé el primero en compartir un momento!</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {entries.map((entry) => (
        <DiaryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
