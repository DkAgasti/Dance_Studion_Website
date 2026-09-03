"use client";

import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/admin/DataTable";
import ImageWithFallback from "@/components/media/ImageWithFallback";

const ROLES = ["Owner", "Admin", "Front Desk"];

const SEED_TEAM = [
  { id: 1, name: "Trishna", email: "trishna@asmdancestudio.com", role: "Owner" },
  { id: 2, name: "Priya Nair", email: "priya.n@asmdancestudio.com", role: "Admin" },
  { id: 3, name: "Front Desk", email: "frontdesk@asmdancestudio.com", role: "Front Desk" },
];

function InviteForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ email, role });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Invite User</DialogTitle>
        <DialogDescription>
          Send an invite to give someone access to this admin dashboard.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-white hover:bg-brand-end/90">
          Send Invite
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Team & Roles" settings section — admin users with access to this dashboard.
export default function TeamRolesSection() {
  const [team, setTeam] = useState(SEED_TEAM);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleRemove(id) {
    setTeam((prev) => prev.filter((t) => t.id !== id));
  }

  function handleInvite(values) {
    const nextId = Math.max(0, ...team.map((t) => t.id)) + 1;
    setTeam((prev) => [
      ...prev,
      { id: nextId, name: values.email.split("@")[0], email: values.email, role: values.role },
    ]);
    setDialogOpen(false);
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImageWithFallback
            gradient="from-brand-mid/25 via-surface to-brand-start/15"
            className="size-8 shrink-0 rounded-full"
          />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium">
          {row.role}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) =>
        row.role !== "Owner" ? (
          <button
            type="button"
            onClick={() => handleRemove(row.id)}
            aria-label={`Remove ${row.name}`}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-brand-start/20 hover:text-brand-start"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="glass-tile rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="h4-display">Team &amp; Roles</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="gap-1.5 rounded-full bg-brand-end text-white hover:bg-brand-end/90"
        >
          <UserPlus className="size-3.5" />
          Invite User
        </Button>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={team} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          {dialogOpen ? <InviteForm onSubmit={handleInvite} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
