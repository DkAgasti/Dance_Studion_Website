"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, Save, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { extractMapEmbedUrl } from "@/lib/utils";

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook URL", badge: "FB" },
  { key: "instagram", label: "Instagram URL", badge: "IG" },
  { key: "youtube", label: "YouTube URL", badge: "YT" },
];

// "Social & Map" settings section — social profile links + Google Maps embed.
export default function SocialMapSection() {
  const [form, setForm] = useState({ facebook: "", instagram: "", youtube: "", mapEmbedUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load social settings.");
        return res.json();
      })
      .then(({ settings }) => {
        if (cancelled) return;
        setForm({
          facebook: settings.socials?.facebook ?? "",
          instagram: settings.socials?.instagram ?? "",
          youtube: settings.socials?.youtube ?? "",
          mapEmbedUrl: extractMapEmbedUrl(settings.mapEmbed) ?? "",
        });
      })
      .catch(() => toast.error("Failed to load social settings."))
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

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socials: { facebook: form.facebook, instagram: form.instagram, youtube: form.youtube },
          mapEmbed: extractMapEmbedUrl(form.mapEmbedUrl),
        }),
      });
      if (!res.ok) throw new Error("Failed to save social settings.");
      toast.success("Social & map settings saved");
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
        Loading social settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="glass-tile rounded-2xl p-6 sm:p-8">
      <h2 className="h4-display">Social &amp; Map</h2>

      <div className="mt-6 flex flex-col gap-5">
        {SOCIAL_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={field.key} className="flex items-center gap-2">
              <span className="glass flex size-5 items-center justify-center rounded-full text-[9px] font-bold">
                {field.badge}
              </span>
              {field.label}
            </Label>
            <Input
              id={field.key}
              value={form[field.key]}
              onChange={(e) => set(field.key)(e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="map-embed">Google Maps Embed Link</Label>
          <Input
            id="map-embed"
            placeholder="https://www.google.com/maps/embed?..."
            value={form.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl")(extractMapEmbedUrl(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            From Google Maps: Share → Embed a map → copy the src URL (pasting the
            whole &lt;iframe&gt; snippet also works — the URL is pulled out automatically).
          </p>
        </div>
        <div>
          <p className="eyebrow !text-[10px]">Preview</p>
          {form.mapEmbedUrl ? (
            <iframe
              key={form.mapEmbedUrl}
              src={form.mapEmbedUrl}
              className="mt-2 h-[168px] w-full rounded-xl border border-border"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <ImageWithFallback
              icon={MapPin}
              gradient="from-surface to-background"
              className="mt-2 h-[168px] w-full rounded-xl border border-border"
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 rounded-full bg-brand-end text-white hover:bg-brand-end/90 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
