// Cloudinary upload helpers — used by app/api/upload/route.js and <MediaUploader />.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Server-side upload — pass a Buffer (e.g. from a parsed multipart form), a
// folder name, and resourceType ("image" | "video"). Returns the Cloudinary
// upload result (includes secure_url, public_id).
export async function uploadImage(fileBuffer, folder, resourceType = "image") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

// Client-side unsigned upload pattern (direct browser -> Cloudinary, no server round-trip):
//
// async function uploadFromBrowser(file) {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
//
//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//     { method: "POST", body: formData }
//   );
//   return res.json(); // { secure_url, public_id, ... }
// }
