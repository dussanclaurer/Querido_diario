import Link from "next/link";
import styles from "./Header.module.css";
import { auth, signOut } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.crown}>👑</span> Querido Diario
        </Link>
        <nav className={styles.nav}>
          {session?.user ? (
            <>
              <Link href="/upload" className={styles.btn}>Subir foto</Link>
              <Link href="/profile" className={styles.userBtn}>
                <div className={styles.userAvatar}>
                  {session.user.avatar ? (
                    <img
                      src={`/api/avatar/${session.user.id}`}
                      alt=""
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span className={styles.avatarLetter}>
                      {(session.user.username ?? "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className={styles.userName}>{session.user.username}</span>
              </Link>
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className={styles.btnOutline}>Salir</button>
              </form>
            </>
          ) : (
            <Link href="/login" className={styles.btn}>Iniciar sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
