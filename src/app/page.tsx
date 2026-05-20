import { db } from "@/db";
import { entries, photos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { PhotoGrid } from "@/components/PhotoGrid/PhotoGrid";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await db
    .select()
    .from(entries)
    .leftJoin(photos, eq(photos.entryId, entries.id))
    .orderBy(desc(entries.createdAt));

  const grouped = new Map<
    string,
    {
      id: string;
      userId: string;
      description: string | null;
      createdAt: Date | null;
      photos: { id: string; url: string }[];
    }
  >();

  for (const row of data) {
    const e = row.entries;
    if (!grouped.has(e.id)) {
      grouped.set(e.id, { ...e, photos: [] });
    }
    if (row.photos) {
      grouped.get(e.id)!.photos.push({
        id: row.photos.id,
        url: row.photos.url,
      });
    }
  }

  const allEntries = Array.from(grouped.values());

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.ornament}>👑</span> Querido Diario
        </h1>
        <p className={styles.subtitle}>Captura momentos, guarda recuerdos.</p>
      </section>
      <PhotoGrid entries={allEntries} />
    </div>
  );
}
