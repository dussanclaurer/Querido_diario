import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { entries, photos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const all = await db
    .select()
    .from(entries)
    .leftJoin(photos, eq(photos.entryId, entries.id))
    .orderBy(desc(entries.createdAt));

  const grouped = new Map<
    string,
    {
      id: string;
      userId: string;
      description: string | null;
      createdAt: Date | null;
      photos: { id: string; url: string; order: number }[];
    }
  >();

  for (const row of all) {
    const e = row.entries;
    if (!grouped.has(e.id)) {
      grouped.set(e.id, { ...e, photos: [] });
    }
    if (row.photos) {
      grouped.get(e.id)!.photos.push({
        id: row.photos.id,
        url: row.photos.url,
        order: row.photos.order,
      });
    }
  }

  const result = Array.from(grouped.values()).map((entry) => ({
    ...entry,
    photos: entry.photos.sort((a, b) => a.order - b.order),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrls, description } = await req.json();
  if (!imageUrls || !imageUrls.length) {
    return NextResponse.json(
      { error: "At least one image is required" },
      { status: 400 }
    );
  }

  const entry = await db
    .insert(entries)
    .values({
      userId: session.user.id,
      description: description || null,
    })
    .returning()
    .then((r) => r[0]);

  if (imageUrls.length > 0) {
    await db.insert(photos).values(
      imageUrls.map((url: string, i: number) => ({
        entryId: entry.id,
        url,
        order: i,
      }))
    );
  }

  return NextResponse.json(entry, { status: 201 });
}
