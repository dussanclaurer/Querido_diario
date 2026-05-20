"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/PhotoUploader/PhotoUploader";
import styles from "./page.module.css";

export default function UploadPage() {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrls.length) return;

    setSaving(true);
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrls, description }),
    });
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Nueva entrada</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PhotoUploader onUploadComplete={setImageUrls} />
        <div className={styles.field}>
          <label htmlFor="desc" className={styles.label}>
            Descripción{" "}
            <span className={styles.optional}>(opcional)</span>
          </label>
          <textarea
            id="desc"
            className={styles.textarea}
            placeholder="¿Qué pasó hoy?"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.submit}
          disabled={!imageUrls.length || saving}
        >
          {saving ? "Guardando..." : "Publicar entrada"}
        </button>
      </form>
    </div>
  );
}
