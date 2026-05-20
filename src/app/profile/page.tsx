import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div style={{
      maxWidth: 500, margin: "0 auto", padding: "40px 20px 80px",
    }}>
      <h1 style={{
        fontFamily: "var(--font-heading)",
        fontSize: "1.5rem", marginBottom: 24,
      }}>
        Tu perfil
      </h1>
      <ProfileForm
        userId={session.user.id}
        username={session.user.username ?? ""}
        avatarUrl={session.user.avatar ? `/api/avatar/${session.user.id}` : null}
      />
    </div>
  );
}
