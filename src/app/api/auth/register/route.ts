import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email válido y contraseña de al menos 6 caracteres requeridos" },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (existing) {
    return NextResponse.json(
      { error: "Este email ya está registrado" },
      { status: 409 }
    );
  }

  const hashedPassword = await hash(password, 12);

  await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
