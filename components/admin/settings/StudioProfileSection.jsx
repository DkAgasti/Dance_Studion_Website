"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";

const EMPTY = {
  studioName: "",
  tagline: "",
  logoUrl: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  openingHours: "",
};

// "Studio Profile" settings section — logo, studio identity, and contact
// details that feed the public footer/contact page/SEO.
export default function StudioProfileSection() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load studio profile.");
        return res.json();
      })
      .then(({ settings }) => {
        if (cancelled) return;
        setForm({
          studioName: settings.name ?? "",
          tagline: settings.tagline ?? "",
          logoUrl: settings.logoUrl ?? "",
          address: settings.address ?? "",
          phone: settings.phone ?? "",
          whatsapp: settings.whatsapp ?? "",
          email: settings.email ?? "",
          openingHours: settings.hours?.text ?? "",
        });
      })
      .catch(() => toast.error("Failed to load studio profile."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleLogo(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "studio");
      set("logoUrl")(url);
    } catch {
      // upload failed — keep the previous logo
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.studioName,
          tagline: form.tagline,
          logoUrl: form.logoUrl,
          address: form.address,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          hours: { text: form.openingHours },
        }),
      });
      if (!res.ok) throw new Error("Failed to save studio profile.");
      toast.success("Studio profile saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-tile flex items-center justify-center gap-2 rounded-2xl p-6 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading studio profile...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="glass-tile rounded-2xl p-6 sm:p-8">
      <h2 className="h4-display">Studio Profile</h2>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <ImageWithFallback
            src={form.logoUrl}
            className="size-24 rounded-2xl border border-border"
          />
          {!form.logoUrl ? (
            <MediaUploader
              accept="image/*"
              label={uploading ? "Uploading..." : "LOGO"}
              className="absolute inset-0 size-24 !p-2 text-[10px] font-bold tracking-wide uppercase"
              onFile={handleLogo}
            />
          ) : null}
        </div>
        <div>
          <p className="font-medium">Studio Logo</p>
          <p className="text-xs text-muted-foreground">
            Recommended size 512x512px. SVG or PNG.
          </p>
          {form.logoUrl ? (
            <button
              type="button"
              onClick={() => set("logoUrl")("")}
              className="mt-1 text-xs text-brand-end underline underline-offset-2"
            >
              Replace logo
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="studio-name">Studio Name</Label>
          <Input
            id="studio-name"
            value={form.studioName}
            onChange={(e) => set("studioName")(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline")(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="full-address">Full Address</Label>
          <Textarea
            id="full-address"
            rows={2}
            value={form.address}
            onChange={(e) => set("address")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp")(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="opening-hours">Opening Hours</Label>
          <Input
            id="opening-hours"
            value={form.openingHours}
            onChange={(e) => set("openingHours")(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic">
          This updates your website footer, contact page and SEO.
        </p>
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
