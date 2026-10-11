"use client";

import { Video, Link2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaUploader from "@/components/admin/MediaUploader";
import { cn } from "@/lib/utils";

// Video source picker — either an uploaded file (preview via object URL) or
// a YouTube/Instagram embed link. `value`: { type: "upload"|"embed", url,
// fileName?, previewUrl? }.
export default function VideoSourceInput({ value, onChange, label = "Video" }) {
  function setType(type) {
    onChange({ type, url: "", fileName: null, previewUrl: null, file: null });
  }

  function handleFile(file) {
    const previewUrl = URL.createObjectURL(file);
    onChange({ type: "upload", url: null, fileName: file.name, previewUrl, file });
  }

  function clearUpload() {
    onChange({ type: "upload", url: null, fileName: null, previewUrl: null, file: null });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("upload")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
            value.type === "upload"
              ? "bg-brand-end text-white"
              : "glass-tile text-muted-foreground hover:text-foreground"
          )}
        >
          <Video className="size-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setType("embed")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
            value.type === "embed"
              ? "bg-brand-end text-white"
              : "glass-tile text-muted-foreground hover:text-foreground"
          )}
        >
          <Link2 className="size-3.5" />
          Embed Link
        </button>
      </div>

      {value.type === "embed" ? (
        <Input
          placeholder="https://youtube.com/... or https://instagram.com/reel/..."
          value={value.url ?? ""}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
        />
      ) : value.previewUrl || value.fileName ? (
        <div className="glass-tile flex items-center justify-between gap-3 rounded-xl p-3">
          <div className="flex min-w-0 items-center gap-3">
            {value.previewUrl ? (
              <video
                src={value.previewUrl}
                className="aspect-9/16 h-16 w-9 shrink-0 rounded-md bg-black object-cover"
                muted
              />
            ) : null}
            <p className="truncate text-sm text-muted-foreground">{value.fileName}</p>
          </div>
          <button
            type="button"
            onClick={clearUpload}
            aria-label="Remove file"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <MediaUploader
          accept="video/*"
          icon={Video}
          label="Upload Video"
          hint="MP4 or MOV, max 50MB"
          onFile={handleFile}
        />
      )}
    </div>
  );
}
