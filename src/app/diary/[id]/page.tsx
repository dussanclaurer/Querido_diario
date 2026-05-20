import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function DiaryEntry({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await db
    .select()
    .from(entries)
    .where(eq(entries.id, id))
    .then((res) => res[0]);

  if (!entry) notFound();

  const date = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className={styles.page}>
      <div className={styles.imageWrap}>
        <img
          src={entry.imageUrl}
          alt={entry.description || "Entrada del diario"}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <time className={styles.date}>{date}</time>
        {entry.description && (
          <p className={styles.desc}>{entry.description}</p>
        )}
      </div>
    </div>
  );
}
