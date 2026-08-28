"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Award, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";

const GRADIENTS = [
  "from-brand-lime/25 via-surface to-brand-end/15",
  "from-brand-mid/25 via-surface to-brand-start/15",
  "from-brand-end/25 via-surface to-brand-lime/15",
];

const EMPTY = { title: "", date: "", url: "" };

function CertificateForm({ certificate, onSubmit }) {
  const [form, setForm] = useState(() =>
    certificate
      ? { title: certificate.caption ?? "", date: certificate.category ?? "", url: certificate.url ?? "" }
      : EMPTY
  );
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "certificates");
      setForm((f) => ({ ...f, url }));
    } catch {
      // upload failed — the certificate can still be saved without an image
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{certificate ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
        <DialogDescription>
          Certificates and awards shown on the About page.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <MediaUploader
          accept="image/*"
          icon={Award}
          label={uploading ? "Uploading..." : "Upload Certificate Image"}
          hint="JPG or PNG"
          onFile={handleUpload}
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-title">Title</Label>
          <Input
            id="c-title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-date">Date</Label>
          <Input
            id="c-date"
            placeholder="e.g. Nov 2024"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {certificate ? "Save Changes" : "Add Certificate"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Certificates" content tab — award/certificate cards. Exposes `openAdd`
// via ref so the page's shared "Add New" button can trigger it.
const CertificatesTab = forwardRef(function CertificatesTab(_props, ref) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=CERTIFICATE")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load certificates.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setCertificates(body.media);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  useImperativeHandle(ref, () => ({ openAdd }));

  function openEdit(cert) {
    setEditing(cert);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = certificates;
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete certificate.");
    } catch (err) {
      setCertificates(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    const payload = {
      type: "CERTIFICATE",
      caption: values.title,
      category: values.date,
      url: values.url,
    };
    try {
      const res = await fetch(editing ? `/api/media/${editing.id}` : "/api/media", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save certificate.");
      const { media } = await res.json();
      setCertificates((prev) =>
        editing ? prev.map((c) => (c.id === media.id ? media : c)) : [...prev, media]
      );
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading certificates...
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MediaUploader
          accept="image/*"
          icon={Award}
          label="Add Certificate"
          hint="JPG or PNG"
          className="aspect-4/3"
          onFile={openAdd}
        />
        {certificates.map((cert, i) => (
          <div key={cert.id} className="group glass-tile overflow-hidden rounded-2xl">
            <div className="relative aspect-4/3">
              <ImageWithFallback
                src={cert.url}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                icon={Award}
                className="absolute inset-0"
              />
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(cert)}
                  aria-label={`Edit ${cert.caption}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert.id)}
                  aria-label={`Delete ${cert.caption}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-brand-start/40"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-medium">{cert.caption}</p>
              <p className="mt-1 text-xs text-muted-foreground">{cert.category}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {dialogOpen ? (
            <CertificateForm
              key={editing?.id ?? "new"}
              certificate={editing}
              onSubmit={handleSubmit}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default CertificatesTab;
