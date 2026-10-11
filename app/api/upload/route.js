// POST /api/upload — uploads a file (multipart/form-data, field "file") to
// Cloudinary and returns its public URL. Optional "folder" and "resourceType"
// ("image" | "video") fields.
import { uploadImage } from "@/lib/storage";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder")?.toString() || "asm-dance-studio";
  const resourceType = formData.get("resourceType")?.toString() || "image";

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, folder, resourceType);
    return Response.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
