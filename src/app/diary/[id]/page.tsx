import { db } from "@/db";
import { entries, photos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/PhotoGallery/PhotoGallery";
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
    .then((r) => r[0]);

  if (!entry) notFound();

  const entryPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.entryId, id))
    .orderBy(photos.order);

  const date = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className={styles.page}>
      <PhotoGallery photos={entryPhotos} />
      <div className={styles.info}>
        <time className={styles.date}>{date}</time>
        {entry.description && (
          <p className={styles.desc}>{entry.description}</p>
        )}
      </div>
    </div>
  );
}
