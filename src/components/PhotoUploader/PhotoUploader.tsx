"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./PhotoUploader.module.css";

type Props = {
  onUploadComplete: (url: string) => void;
};

export function PhotoUploader({ onUploadComplete }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    onUploadComplete(data.url);
    setUploading(false);
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        uploading ? (
          <div className={styles.status}>
            <div className={styles.spinner} />
            <p>Subiendo foto...</p>
          </div>
        ) : (
          <img src={preview} alt="Preview" className={styles.preview} />
        )
      ) : (
        <div className={styles.placeholder}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>{isDragActive ? "Suelta la foto aquí" : "Arrastra o haz clic para subir una foto"}</p>
          <span className={styles.hint}>PNG, JPG o WebP · Máx 10 MB</span>
        </div>
      )}
    </div>
  );
}
