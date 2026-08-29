"use client";

import { useState } from "react";
import { Upload, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";
import { cn } from "@/lib/utils";

// Image source picker — either upload a file (goes to Cloudinary) or paste
// a direct image URL. `value`/`onChange` deal in a plain URL string.
export default function ImageSourceInput({ value, onChange, folder = "misc", label = "Image" }) {
  const [mode, setMode] = useState("upload");
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, folder);
      onChange(url);
    } catch {
      // upload failed — the record can still be saved without an image
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
            mode === "upload"
              ? "bg-brand-end text-background"
              : "glass-tile text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="size-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
            mode === "link"
              ? "bg-brand-end text-background"
              : "glass-tile text-muted-foreground hover:text-foreground"
          )}
        >
          <Link2 className="size-3.5" />
          Image Link
        </button>
      </div>

      {mode === "link" ? (
        <Input
          placeholder="https://example.com/photo.jpg"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <MediaUploader
          accept="image/*"
          label={uploading ? "Uploading..." : value ? "Image uploaded" : "Upload Image"}
          hint="JPG or PNG"
          onFile={handleFile}
        />
      )}

      {value ? (
        <ImageWithFallback src={value} className="aspect-video w-full rounded-xl border border-border" />
      ) : null}
    </div>
  );
}
