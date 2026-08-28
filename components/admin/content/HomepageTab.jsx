"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import VideoSourceInput from "@/components/admin/content/VideoSourceInput";
import { uploadFile } from "@/lib/uploadClient";

const DEFAULT_STATS = [
  { id: 1, label: "Students", value: "" },
  { id: 2, label: "Five-Star Reviews", value: "" },
  { id: 3, label: "Dance Styles", value: "" },
  { id: 4, label: "Years of Experience", value: "" },
];

// "Homepage" content tab — editable hero copy, hero video, and stat numbers.
export default function HomepageTab() {
  const [content, setContent] = useState({
    heroHeading: "",
    heroSubtext: "",
    heroImageUrl: "",
    heroVideo: { type: "embed", url: "", fileName: null, previewUrl: null, file: null },
    stats: DEFAULT_STATS,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load homepage content.");
        return res.json();
      })
      .then(({ settings }) => {
        if (cancelled) return;
        setContent({
          heroHeading: settings.heroHeading ?? "",
          heroSubtext: settings.heroSubtext ?? "",
          heroImageUrl: settings.heroImageUrl ?? "",
          heroVideo: {
            type: "embed",
            url: settings.heroVideoUrl ?? "",
            fileName: null,
            previewUrl: null,
            file: null,
          },
          stats: settings.stats?.length ? settings.stats : DEFAULT_STATS,
        });
      })
      .catch(() => {
        toast.error("Failed to load homepage content.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateStat(id, key, value) {
    setContent((c) => ({
      ...c,
      stats: c.stats.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  }

  async function handleHeroImage(file) {
    setUploadingImage(true);
    try {
      const { url } = await uploadFile(file, "homepage");
      setContent((c) => ({ ...c, heroImageUrl: url }));
    } catch {
      // upload failed — keep the previous image
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let heroVideoUrl = content.heroVideo.url;
      if (content.heroVideo.type === "upload" && content.heroVideo.file) {
        const uploaded = await uploadFile(content.heroVideo.file, "homepage", "video");
        heroVideoUrl = uploaded.url;
      }

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroHeading: content.heroHeading,
          heroSubtext: content.heroSubtext,
          heroImageUrl: content.heroImageUrl,
          heroVideoUrl,
          stats: content.stats,
        }),
      });
      if (!res.ok) throw new Error("Failed to save homepage content.");
      toast.success("Homepage content saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading homepage content...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-8">
      <div className="glass-tile rounded-2xl p-6">
        <h3 className="font-medium">Hero Section</h3>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hero-heading">Hero Heading</Label>
            <Input
              id="hero-heading"
              value={content.heroHeading}
              onChange={(e) => setContent((c) => ({ ...c, heroHeading: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hero-subtext">Hero Subtext</Label>
            <Textarea
              id="hero-subtext"
              rows={2}
              value={content.heroSubtext}
              onChange={(e) => setContent((c) => ({ ...c, heroSubtext: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Hero Image</Label>
            {content.heroImageUrl ? (
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={content.heroImageUrl}
                  className="aspect-4/3 w-32 shrink-0 rounded-xl border border-border"
                />
                <button
                  type="button"
                  onClick={() => setContent((c) => ({ ...c, heroImageUrl: "" }))}
                  className="text-xs text-brand-end underline underline-offset-2"
                >
                  Replace image
                </button>
              </div>
            ) : (
              <MediaUploader
                accept="image/*"
                label={uploadingImage ? "Uploading..." : "Upload Hero Image"}
                hint="JPG or PNG"
                onFile={handleHeroImage}
              />
            )}
          </div>
          <VideoSourceInput
            label="Hero Background Video (optional)"
            value={content.heroVideo}
            onChange={(heroVideo) => setContent((c) => ({ ...c, heroVideo }))}
          />
        </div>
      </div>

      <div className="glass-tile rounded-2xl p-6">
        <h3 className="font-medium">Stat Numbers</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown in the stats row on the homepage.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {content.stats.map((stat) => (
            <div key={stat.id} className="flex gap-3">
              <div className="flex w-24 flex-col gap-1.5">
                <Label htmlFor={`stat-value-${stat.id}`}>Value</Label>
                <Input
                  id={`stat-value-${stat.id}`}
                  value={stat.value}
                  onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={`stat-label-${stat.id}`}>Label</Label>
                <Input
                  id={`stat-label-${stat.id}`}
                  value={stat.label}
                  onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:opacity-60"
      >
        <Save className="size-4" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
