import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
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

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const urls = await Promise.all(
    files.map(async (file) => {
      const rawBuffer = Buffer.from(await file.arrayBuffer());

      const optimizedBuffer = await sharp(rawBuffer)
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const id = crypto.randomUUID();
      const filename = `${id}.webp`;
      await writeFile(join(uploadDir, filename), optimizedBuffer);

      return `/uploads/${filename}`;
    })
  );

  return NextResponse.json({ urls });
}
