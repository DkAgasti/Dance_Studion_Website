"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import DataTable from "@/components/admin/DataTable";

function planToForm(plan) {
  return plan
    ? {
        name: plan.name,
        tagline: plan.tagline ?? "",
        monthlyPrice: String(plan.monthlyPrice ?? ""),
        quarterlyPrice: String(plan.quarterlyPrice ?? ""),
        features: (plan.features ?? []).join("\n"),
        highlighted: plan.highlighted,
        ctaLabel: plan.ctaLabel ?? "",
      }
    : {
        name: "",
        tagline: "",
        monthlyPrice: "",
        quarterlyPrice: "",
        features: "",
        highlighted: false,
        ctaLabel: "Enroll Now",
      };
}

function PlanForm({ plan, onSubmit }) {
  const [form, setForm] = useState(() => planToForm(plan));

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: form.name,
      tagline: form.tagline,
      monthlyPrice: Number(form.monthlyPrice),
      quarterlyPrice: Number(form.quarterlyPrice),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      highlighted: form.highlighted,
      ctaLabel: form.ctaLabel,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{plan ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <DialogDescription>This feeds the public /pricing page.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p-name">Plan Name</Label>
          <Input id="p-name" required value={form.name} onChange={(e) => set("name")(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p-tagline">Tagline</Label>
          <Input
            id="p-tagline"
            value={form.tagline}
            onChange={(e) => set("tagline")(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-monthly">Monthly Price (₹)</Label>
            <Input
              id="p-monthly"
              type="number"
              required
              value={form.monthlyPrice}
              onChange={(e) => set("monthlyPrice")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-quarterly">Quarterly Price (₹/mo)</Label>
            <Input
              id="p-quarterly"
              type="number"
              required
              value={form.quarterlyPrice}
              onChange={(e) => set("quarterlyPrice")(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p-features">Features (one per line)</Label>
          <Textarea
            id="p-features"
            rows={4}
            value={form.features}
            onChange={(e) => set("features")(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p-cta">Button Label</Label>
          <Input id="p-cta" value={form.ctaLabel} onChange={(e) => set("ctaLabel")(e.target.value)} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3">
          <Label htmlFor="p-highlighted" className="cursor-pointer">
            Mark as &quot;Most Popular&quot;
          </Label>
          <Switch
            id="p-highlighted"
            checked={form.highlighted}
            onCheckedChange={(v) => set("highlighted")(v)}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-white hover:bg-brand-end/90">
          {plan ? "Save Changes" : "Add Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Plans & Pricing" settings section — feeds the public /pricing page.
export default function PlansPricingSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/plans")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load plans.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setPlans(body.plans);
      })
      .catch(() => toast.error("Failed to load plans."))
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

  function openEdit(plan) {
    setEditing(plan);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = plans;
    setPlans((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete plan.");
    } catch (err) {
      setPlans(previous);
      toast.error(err.message);
    }
  }

  async function handleSubmit(values) {
    try {
      const res = await fetch(editing ? `/api/plans/${editing.id}` : "/api/plans", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save plan.");
      const { plan } = await res.json();
      setPlans((prev) =>
        editing ? prev.map((p) => (p.id === plan.id ? plan : p)) : [...prev, plan]
      );
      setDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Plan",
      render: (row) => (
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.name}</p>
          {row.highlighted ? (
            <span className="rounded-full bg-brand-lime-tint px-2 py-0.5 text-[10px] font-bold text-brand-lime-ink uppercase">
              Popular
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "monthlyPrice",
      label: "Monthly",
      render: (row) => `₹${row.monthlyPrice.toLocaleString("en-IN")}`,
    },
    {
      key: "quarterlyPrice",
      label: "Quarterly (/mo)",
      render: (row) => `₹${row.quarterlyPrice.toLocaleString("en-IN")}`,
    },
    {
      key: "features",
      label: "Features",
      render: (row) => `${row.features.length} included`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(row)}
            aria-label={`Edit ${row.name}`}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            aria-label={`Delete ${row.name}`}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-brand-start/20 hover:text-brand-start"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="glass-tile rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h4-display">Plans &amp; Pricing</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Feeds the plan cards on the public pricing page.
          </p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-1.5 rounded-full bg-brand-end text-white hover:bg-brand-end/90">
          <Plus className="size-3.5" />
          Add Plan
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading plans...
          </div>
        ) : (
          <DataTable columns={columns} rows={plans} />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg sm:max-w-lg">
          {dialogOpen ? (
            <PlanForm key={editing?.id ?? "new"} plan={editing} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
