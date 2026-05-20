import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN && !!process.env.VERCEL;

    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const id = crypto.randomUUID();
        const filename = `${id}.webp`;

        if (useBlob) {
          const blob = await put(filename, buffer, {
            access: "private",
            contentType: "image/webp",
          });
          return blob.downloadUrl;
        }

        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);
        return `/uploads/${filename}`;
      })
    );

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", detail: String(err) },
      { status: 500 }
    );
  }
}
