"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaUploader from "@/components/admin/MediaUploader";
import { uploadFile } from "@/lib/uploadClient";

const AGE_OPTIONS = ["Kids", "Teens", "Adults", "All Ages"];
const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const EMPTY = {
  name: "",
  description: "",
  ageGroup: "",
  level: "",
  imageUrl: "",
  featured: false,
};

function classToForm(danceClass) {
  if (!danceClass) return EMPTY;
  return {
    name: danceClass.name,
    description: danceClass.description ?? "",
    ageGroup: danceClass.ageGroup ?? "",
    level: danceClass.level ?? "",
    imageUrl: danceClass.imageUrl ?? "",
    featured: danceClass.featured ?? false,
  };
}

function ClassForm({ danceClass, onSubmit }) {
  const [form, setForm] = useState(() => classToForm(danceClass));
  const [uploading, setUploading] = useState(false);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePhoto(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "classes");
      set("imageUrl")(url);
    } catch {
      // upload failed — the class can still be saved without an image
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
        <DialogTitle>{danceClass ? "Edit Class" : "Add Class"}</DialogTitle>
        <DialogDescription>
          Shown on the public /classes page and its Age/Style filters.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <MediaUploader
          accept="image/*"
          label={uploading ? "Uploading..." : "Upload Image"}
          hint="JPG or PNG"
          onFile={handlePhoto}
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-name">Class Name</Label>
          <Input
            id="cl-name"
            placeholder="e.g. Hip-Hop"
            required
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-description">Description</Label>
          <Textarea
            id="cl-description"
            rows={3}
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Age Group</Label>
            <Select value={form.ageGroup} onValueChange={set("ageGroup")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {AGE_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Level</Label>
            <Select value={form.level} onValueChange={set("level")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3">
          <Label htmlFor="cl-featured" className="cursor-pointer">
            Featured
          </Label>
          <Switch
            id="cl-featured"
            checked={form.featured}
            onCheckedChange={set("featured")}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {danceClass ? "Save Changes" : "Add Class"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Add/Edit class dialog — POSTs/PATCHes /api/classes.
export default function ClassFormDialog({ open, onOpenChange, danceClass, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open ? (
          <ClassForm key={danceClass?.id ?? "new"} danceClass={danceClass} onSubmit={onSubmit} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
