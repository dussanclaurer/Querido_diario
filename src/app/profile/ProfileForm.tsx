"use client";

import { useState, useRef } from "react";
import { optimizeImage } from "@/lib/imageOptimizer";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  username: string;
  avatarUrl: string | null;
};

export function ProfileForm({ userId, username, avatarUrl }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const compressed = await optimizeImage(file, 200);
    const optimizedFile = new File([compressed], "avatar.webp", { type: "image/webp" });

    const formData = new FormData();
    formData.append("avatar", optimizedFile);

    const res = await fetch("/api/user/avatar", { method: "POST", body: formData });
    if (res.ok) {
      setPreview(URL.createObjectURL(compressed));
      setMessage("Foto actualizada");
      router.refresh();
    } else {
      setMessage("Error al subir");
    }

    setUploading(false);
  };

  const avatarSrc = preview || "/api/avatar/" + userId;

  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "var(--radius)",
      padding: 32, boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--gold-light)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
          background: "var(--pink-light)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", color: "var(--rose-dark)", fontWeight: 700,
        }}>
          {preview ? (
            <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setPreview(null)} />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{username}</p>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              marginTop: 8, padding: "6px 16px", borderRadius: 8,
              border: "1px solid var(--rose)", background: "transparent",
              cursor: "pointer", fontSize: "0.85rem",
            }}
          >
            {uploading ? "Subiendo..." : "Cambiar foto"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>
      </div>
      {message && (
        <p style={{
          padding: "8px 14px", borderRadius: 8, fontSize: "0.85rem",
          background: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
          color: message.includes("Error") ? "#dc2626" : "#16a34a",
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
