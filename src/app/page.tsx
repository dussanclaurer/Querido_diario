import { db } from "@/db";
import { entries } from "@/db/schema";
import { PhotoGrid } from "@/components/PhotoGrid/PhotoGrid";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(entries.createdAt);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Querido Diario</h1>
        <p className={styles.subtitle}>Captura momentos, guarda recuerdos.</p>
      </section>
      <PhotoGrid entries={allEntries} />
    </div>
  );
}
