"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { optimizeImage } from "@/lib/imageOptimizer";
import styles from "./PhotoUploader.module.css";

type Props = {
  onUploadComplete: (urls: string[]) => void;
};

export function PhotoUploader({ onUploadComplete }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;

      setUploading(true);

      const thumbs = accepted.map((f) => URL.createObjectURL(f));
      setPreviews(thumbs);

      const optimized = await Promise.all(
        accepted.map((f) => optimizeImage(f))
      );

      const optimizedFiles = optimized.map(
        (blob, i) =>
          new File([blob], accepted[i].name.replace(/\.[^.]+$/, ".webp"), {
            type: "image/webp",
          })
      );

      const formData = new FormData();
      optimizedFiles.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      setUploading(false);
      onUploadComplete(data.urls);
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className={styles.status}>
            <div className={styles.spinner} />
            <p>Comprimiendo y subiendo fotos...</p>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>
              {isDragActive
                ? "Suelta las fotos aquí"
                : "Arrastra o haz clic para subir fotos"}
            </p>
            <span className={styles.hint}>PNG, JPG o WebP · Máx 10 MB c/u</span>
          </div>
        )}
      </div>

      {previews.length > 0 && !uploading && (
        <div className={styles.previewGrid}>
          {previews.map((src, i) => (
            <div key={i} className={styles.previewItem}>
              <img src={src} alt={`Preview ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
