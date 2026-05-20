import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { entries } from "@/db/schema";

export async function GET() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(entries.createdAt);
  return NextResponse.json(allEntries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl, description } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const entry = await db
    .insert(entries)
    .values({
      userId: session.user.id,
      imageUrl,
      description: description || null,
    })
    .returning();

  return NextResponse.json(entry[0], { status: 201 });
}
