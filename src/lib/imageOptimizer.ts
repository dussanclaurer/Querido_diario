export async function optimizeImage(
  file: File,
  maxDimension = 1920,
  quality = 0.8
): Promise<Blob> {
  const img = await createImageBitmap(file);

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  img.close();

  const blob = await canvas.convertToBlob({ type: "image/webp", quality });
  return blob;
}
