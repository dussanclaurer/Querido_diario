import { db } from "@/db";
import { entries, photos, users } from "@/db/schema";
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

  const row = await db
    .select()
    .from(entries)
    .leftJoin(users, eq(entries.userId, users.id))
    .where(eq(entries.id, id))
    .then((r) => r[0]);

  if (!row) notFound();

  const u = row.users;
  const entry = {
    ...row.entries,
    authorName: u?.username ?? "Anónimo",
    authorAvatar: u?.avatar ? `/api/avatar/${u.id}` : null,
  };

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
        <div className={styles.authorRow}>
          <div className={styles.avatar}>
            {entry.authorAvatar ? (
              <img src={entry.authorAvatar} alt="" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarLetter}>
                {entry.authorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className={styles.authorName}>{entry.authorName}</span>
            <time className={styles.date}>{date}</time>
          </div>
        </div>
        {entry.description && (
          <p className={styles.desc}>{entry.description}</p>
        )}
      </div>
    </div>
  );
}
