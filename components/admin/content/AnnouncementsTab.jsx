"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Megaphone, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const EMPTY = { title: "", text: "", link: "", startsAt: "", endsAt: "", active: false };

function toForm(a) {
  if (!a) return EMPTY;
  return {
    title: a.title ?? "",
    text: a.text ?? "",
    link: a.link ?? "",
    startsAt: a.startsAt ? a.startsAt.slice(0, 10) : "",
    endsAt: a.endsAt ? a.endsAt.slice(0, 10) : "",
    active: a.active ?? false,
  };
}

// "Announcements" content tab — promo banner/popup editor with a live preview.
export default function AnnouncementsTab() {
  const [id, setId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/announcements")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load announcement.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) {
          setId(body.announcement?.id ?? null);
          setForm(toForm(body.announcement));
        }
      })
      .catch(() => {
        toast.error("Failed to load the announcement.");
      })
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
      const res = await fetch(id ? `/api/announcements/${id}` : "/api/announcements", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save announcement.");
      const body = await res.json();
      setId(body.announcement.id);
      toast.success("Announcement saved");
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
        Loading announcement...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form onSubmit={handleSave} className="glass-tile flex flex-col gap-4 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-medium">
              <Megaphone className="size-4 text-brand-lime" />
              Promo Banner
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Shown as a banner across the top of the public site.
            </p>
          </div>
          <Switch checked={form.active} onCheckedChange={set("active")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-title">Title</Label>
          <Input id="a-title" value={form.title} onChange={(e) => set("title")(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-text">Text</Label>
          <Textarea
            id="a-text"
            rows={2}
            value={form.text}
            onChange={(e) => set("text")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-link">Link</Label>
          <Input id="a-link" value={form.link} onChange={(e) => set("link")(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="a-start">Start Date</Label>
            <Input
              id="a-start"
              type="date"
              value={form.startsAt}
              onChange={(e) => set("startsAt")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="a-end">End Date</Label>
            <Input
              id="a-end"
              type="date"
              value={form.endsAt}
              onChange={(e) => set("endsAt")(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="mt-2 w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Announcement"}
        </Button>
      </form>

      <div>
        <p className="eyebrow !text-[10px]">Live Preview</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border">
          {form.active ? (
            <div className="bg-gradient-brand flex flex-col items-center gap-2 px-6 py-4 text-center sm:flex-row sm:justify-center sm:gap-4">
              <p className="text-sm font-bold text-white">
                {form.title || "Your announcement title"}
              </p>
              <p className="text-sm text-white/85">{form.text || "Announcement text goes here."}</p>
              {form.link ? (
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold whitespace-nowrap text-background">
                  Learn More
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-white/[0.02] px-6 py-10 text-center">
              <Megaphone className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Announcement is off — nothing will show on the public site.
              </p>
            </div>
          )}
        </div>
        {form.active && (form.startsAt || form.endsAt) ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Runs {form.startsAt || "…"} through {form.endsAt || "…"}
          </p>
        ) : null}
      </div>
    </div>
  );
}
