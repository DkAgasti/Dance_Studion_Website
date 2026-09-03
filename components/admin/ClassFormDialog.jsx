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
  longDescription: "",
  whatYoullLearn: "",
  galleryImages: "",
  faqs: "",
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
    longDescription: danceClass.longDescription ?? "",
    whatYoullLearn: (danceClass.whatYoullLearn ?? []).join("\n"),
    galleryImages: (danceClass.galleryImages ?? []).join("\n"),
    faqs: (danceClass.faqs ?? []).map((f) => `${f.q} :: ${f.a}`).join("\n"),
  };
}

function ClassForm({ danceClass, onSubmit }) {
  const [form, setForm] = useState(() => classToForm(danceClass));
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  function appendGalleryUrl(url) {
    setForm((f) => ({
      ...f,
      galleryImages: f.galleryImages ? `${f.galleryImages}\n${url}` : url,
    }));
  }

  async function handleGalleryFile(file) {
    setUploadingGallery(true);
    try {
      const isVideo = file.type.startsWith("video/");
      const { url } = await uploadFile(file, "classes/gallery", isVideo ? "video" : "image");
      appendGalleryUrl(url);
    } catch {
      // upload failed — admin can still paste a URL directly
    } finally {
      setUploadingGallery(false);
    }
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
    onSubmit({
      ...form,
      whatYoullLearn: form.whatYoullLearn
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      galleryImages: form.galleryImages
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      faqs: form.faqs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [q, ...rest] = line.split("::");
          return { q: q.trim(), a: rest.join("::").trim() };
        })
        .filter((f) => f.q && f.a),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-0 self-start">
      <DialogHeader>
        <DialogTitle>{danceClass ? "Edit Class" : "Add Class"}</DialogTitle>
        <DialogDescription>
          Shown on the public /classes page and its Age/Style filters.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
        <MediaUploader
          accept="image/*"
          label={uploading ? "Uploading..." : "Upload Image"}
          hint="JPG or PNG"
          onFile={handlePhoto}
          onUrl={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
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
          <Label htmlFor="cl-description">Short Description</Label>
          <Textarea
            id="cl-description"
            rows={2}
            placeholder="Shown under the class title on the hero."
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-long-description">About This Class</Label>
          <Textarea
            id="cl-long-description"
            rows={4}
            placeholder="Full paragraph(s) shown in the 'About This Class' section."
            value={form.longDescription}
            onChange={(e) => set("longDescription")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-learn">What You&apos;ll Learn (one per line)</Label>
          <Textarea
            id="cl-learn"
            rows={5}
            placeholder={"Foundation: Bounce, Rock, and Bob\nIsolation and Body Control"}
            value={form.whatYoullLearn}
            onChange={(e) => set("whatYoullLearn")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-gallery">
            Class Energy — Photos &amp; Dance Clips (one URL per line)
          </Label>
          <MediaUploader
            accept="image/*,video/*"
            label={uploadingGallery ? "Uploading..." : "Upload Photo or Video Clip"}
            hint="Adds to the list below — upload a short student dance clip or a photo"
            onFile={handleGalleryFile}
            onUrl={appendGalleryUrl}
          />
          <Textarea
            id="cl-gallery"
            rows={4}
            placeholder="https://..."
            value={form.galleryImages}
            onChange={(e) => set("galleryImages")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cl-faqs">Class FAQs (one per line, &quot;Question :: Answer&quot;)</Label>
          <Textarea
            id="cl-faqs"
            rows={4}
            placeholder={"Is this class suitable for beginners? :: Yes, we start from the basics."}
            value={form.faqs}
            onChange={(e) => set("faqs")(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
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
          <div className="flex min-w-0 flex-col gap-1.5">
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

      <DialogFooter className="mx-0 mb-0 mt-4 rounded-none border-t-0 bg-transparent p-0">
        <Button type="submit" className="rounded-full bg-brand-end text-white hover:bg-brand-end/90">
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
      <DialogContent className="max-w-lg sm:max-w-lg">
        {open ? (
          <ClassForm key={danceClass?.id ?? "new"} danceClass={danceClass} onSubmit={onSubmit} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
