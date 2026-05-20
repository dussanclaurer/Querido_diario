import Link from "next/link";
import styles from "./Header.module.css";
import { auth, signOut } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Querido Diario
        </Link>
        <nav className={styles.nav}>
          {session?.user ? (
            <>
              <Link href="/upload" className={styles.btn}>Subir foto</Link>
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className={styles.btnOutline}>Cerrar sesión</button>
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
