"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import ImageSourceInput from "@/components/admin/content/ImageSourceInput";

const ACCENTS = ["brand-start", "brand-mid", "brand-end", "brand-lime"];

const EMPTY = {
  name: "",
  eyebrow: "",
  description: "",
  longDescription: "",
  imageUrl: "",
  accent: "brand-start",
  ctaLabel: "",
  ctaHref: "",
  benefits: "",
};

function toFormState(service) {
  return service
    ? {
        name: service.name,
        eyebrow: service.eyebrow ?? "",
        description: service.description ?? "",
        longDescription: service.longDescription ?? "",
        imageUrl: service.imageUrl ?? "",
        accent: service.accent ?? "brand-start",
        ctaLabel: service.ctaLabel ?? "",
        ctaHref: service.ctaHref ?? "",
        benefits: (service.benefits ?? []).join("\n"),
      }
    : EMPTY;
}

function ServiceForm({ service, onSubmit }) {
  const [form, setForm] = useState(() => toFormState(service));

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      benefits: form.benefits
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
        <DialogDescription>Service blocks shown on the /services page.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
        <ImageSourceInput
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          folder="services"
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-name">Name</Label>
          <Input
            id="sv-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-eyebrow">Eyebrow</Label>
          <Input
            id="sv-eyebrow"
            placeholder="e.g. Cardio Party"
            value={form.eyebrow}
            onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-description">Short Description</Label>
          <Textarea
            id="sv-description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-long">Full Description</Label>
          <Textarea
            id="sv-long"
            rows={3}
            value={form.longDescription}
            onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-benefits">Benefits (one per line)</Label>
          <Textarea
            id="sv-benefits"
            rows={4}
            value={form.benefits}
            onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-accent">Accent Color</Label>
          <select
            id="sv-accent"
            value={form.accent}
            onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
            className="h-10 rounded-lg border border-border bg-transparent px-3 text-sm"
          >
            {ACCENTS.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-cta-label">CTA Label</Label>
          <Input
            id="sv-cta-label"
            placeholder="e.g. Book Trial"
            value={form.ctaLabel}
            onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sv-cta-href">CTA Link</Label>
          <Input
            id="sv-cta-href"
            placeholder="e.g. /book-trial"
            value={form.ctaHref}
            onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {service ? "Save Changes" : "Add Service"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Services" content tab — the /services page blocks. Exposes `openAdd` via
// ref so the page's shared "Add New" button can trigger it.
const ServicesTab = forwardRef(function ServicesTab(_props, ref) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load services.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setServices(body.services);
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

  function openEdit(service) {
    setEditing(service);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = services;
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service.");
    } catch (err) {
      setServices(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    try {
      const res = await fetch(editing ? `/api/services/${editing.id}` : "/api/services", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save service.");
      const { service } = await res.json();
      setServices((prev) =>
        editing ? prev.map((s) => (s.id === service.id ? service : s)) : [...prev, service]
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
        Loading services...
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
        {services.map((service) => (
          <div key={service.id} className="group glass-tile overflow-hidden rounded-2xl">
            <div className="relative">
              <ImageWithFallback
                src={service.imageUrl}
                gradient={service.gradient}
                className="aspect-video w-full"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  aria-label={`Edit ${service.name}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  aria-label={`Delete ${service.name}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand-start/60"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-bold tracking-wide text-brand-mid uppercase">
                {service.eyebrow}
              </p>
              <p className="mt-1 font-medium">{service.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {dialogOpen ? (
            <ServiceForm key={editing?.id ?? "new"} service={editing} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ServicesTab;
