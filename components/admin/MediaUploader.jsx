"use client";

import { useRef, useState } from "react";
import { Upload, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Drag-and-drop upload dropzone — UI only for now (no backend). Calls
// onFile(file) with the selected File so the caller can preview it (e.g.
// via URL.createObjectURL) until real storage (R2/Cloudinary) is wired up.
// Also offers a "paste a link" fallback for anyone who already has a hosted
// image/video URL — calls onUrl(url) with the pasted link instead.
export default function MediaUploader({
  accept = "image/*",
  onFile,
  onUrl,
  label = "Upload File",
  hint,
  icon: Icon = Upload,
  className,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (file) onFile?.(file);
  }

  function submitUrl() {
    const trimmed = urlValue.trim();
    if (trimmed) {
      onUrl?.(trimmed);
      setUrlValue("");
      setShowUrlInput(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
        dragOver
          ? "border-brand-end bg-brand-end/5"
          : "border-border hover:border-white/25",
        className
      )}
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
    >
      {showUrlInput ? (
        <div className="flex w-full flex-col gap-2">
          <input
            type="url"
            autoFocus
            required
            placeholder="https://..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitUrl();
              }
            }}
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-end"
          />
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={submitUrl}
              className="rounded-full bg-brand-end px-4 py-1.5 text-xs font-bold text-background"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlValue("");
              }}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button type="button" onClick={() => inputRef.current?.click()} className="contents">
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

          {onUrl ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand-end hover:underline"
            >
              <Link2 className="size-3.5" />
              Or paste a link
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
