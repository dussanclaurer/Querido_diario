import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const urls = await Promise.all(
    files.map(async (file) => {
      const rawBuffer = Buffer.from(await file.arrayBuffer());

      const optimizedBuffer = await sharp(rawBuffer)
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const name = file.name.replace(/\.[^.]+$/, ".webp");
      const blob = await put(name, optimizedBuffer, {
        access: "public",
        contentType: "image/webp",
      });

      return blob.url;
    })
  );

  return NextResponse.json({ urls });
}
