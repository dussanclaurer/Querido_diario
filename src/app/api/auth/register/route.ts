import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Usuario, email y contraseña de al menos 6 caracteres requeridos" },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)))
    .then((res) => res[0]);

  if (existing) {
    const msg =
      existing.email === email
        ? "Este email ya está registrado"
        : "Este nombre de usuario ya está en uso";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const hashedPassword = await hash(password, 12);

  await db.insert(users).values({
    id: crypto.randomUUID(),
    username,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
