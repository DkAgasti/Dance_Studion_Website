"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Drag-and-drop upload dropzone — UI only for now (no backend). Calls
// onFile(file) with the selected File so the caller can preview it (e.g.
// via URL.createObjectURL) until real storage (R2/Cloudinary) is wired up.
export default function MediaUploader({
  accept = "image/*",
  onFile,
  label = "Upload File",
  hint,
  icon: Icon = Upload,
  className,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (file) onFile?.(file);
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
        dragOver
          ? "border-brand-end bg-brand-end/5"
          : "border-border hover:border-white/25",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="flex size-11 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </button>
  );
}
