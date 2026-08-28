"use client";

// Browser helper for POST /api/upload — used by any admin form/uploader that
// needs to turn a File into a Cloudinary URL before saving a record.
export async function uploadFile(file, folder, resourceType) {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  if (resourceType) formData.append("resourceType", resourceType);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Failed to upload file.");
  }
  return res.json();
}
