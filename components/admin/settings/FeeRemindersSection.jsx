"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const SCHEDULE_OPTIONS = [
  { key: "threeDaysBefore", label: "3 days before due date" },
  { key: "onDueDate", label: "On the due date" },
  { key: "overdue", label: "When overdue" },
];

const CHANNEL_OPTIONS = [
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
];

const DEFAULT_TEMPLATE =
  "Hi {{name}}, this is a reminder that your fee of ₹{{amount}} is due on {{due_date}}. Please make your payment at your earliest convenience to avoid a break in classes.";

const DEFAULT_CONFIG = {
  schedule: { threeDaysBefore: true, onDueDate: true, overdue: true },
  channels: { email: true, whatsapp: true },
  template: DEFAULT_TEMPLATE,
};

// "Fee Reminders" settings section — when to send, which channels, and the
// editable message template. Read by app/api/cron/fee-reminders.
export default function FeeRemindersSection() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reminder settings.");
        return res.json();
      })
      .then(({ settings }) => {
        if (!cancelled && settings.reminderConfig) {
          setConfig({ ...DEFAULT_CONFIG, ...settings.reminderConfig });
        }
      })
      .catch(() => toast.error("Failed to load reminder settings."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderConfig: config }),
      });
      if (!res.ok) throw new Error("Failed to save reminder settings.");
      toast.success("Fee reminder settings saved");
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
        Loading reminder settings...
      </div>
    );
  }

  return (
    <div className="glass-tile rounded-2xl p-6 sm:p-8">
      <h2 className="h4-display">Fee Reminders</h2>

      <div className="mt-6">
        <p className="eyebrow !text-[10px]">Send Reminders</p>
        <div className="mt-3 flex flex-col gap-3">
          {SCHEDULE_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3"
            >
              <Label htmlFor={opt.key} className="cursor-pointer font-normal">
                {opt.label}
              </Label>
              <Switch
                id={opt.key}
                checked={config.schedule[opt.key]}
                onCheckedChange={(v) =>
                  setConfig((c) => ({ ...c, schedule: { ...c.schedule, [opt.key]: v } }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="eyebrow !text-[10px]">Channels</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          {CHANNEL_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className="flex flex-1 items-center justify-between rounded-xl bg-white/[0.02] p-3"
            >
              <Label htmlFor={`ch-${opt.key}`} className="cursor-pointer font-normal">
                {opt.label}
              </Label>
              <Switch
                id={`ch-${opt.key}`}
                checked={config.channels[opt.key]}
                onCheckedChange={(v) =>
                  setConfig((c) => ({ ...c, channels: { ...c.channels, [opt.key]: v } }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-1.5">
        <Label htmlFor="template">Message Template</Label>
        <Textarea
          id="template"
          rows={4}
          value={config.template}
          onChange={(e) => setConfig((c) => ({ ...c, template: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">
          Placeholders: <code className="text-brand-end">{"{{name}}"}</code>{" "}
          <code className="text-brand-end">{"{{amount}}"}</code>{" "}
          <code className="text-brand-end">{"{{due_date}}"}</code>
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
