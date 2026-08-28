"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const fieldClassName = "h-12 rounded-xl border-border bg-white/[0.04] px-4";

export default function StepStudentDetails({ register, errors, photoName, onPhotoChange }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(files) {
    const file = files?.[0];
    if (file) onPhotoChange(file.name, file);
  }

  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Student Details</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Please provide the primary information for the student enrolling.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            className={fieldClassName}
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            className={fieldClassName}
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className={fieldClassName}
            aria-invalid={!!errors.dob}
            {...register("dob")}
          />
          {errors.dob ? (
            <p className="text-xs text-destructive">{errors.dob.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            defaultValue=""
            aria-invalid={!!errors.gender}
            className={cn(
              fieldClassName,
              "w-full appearance-none border text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
            )}
            {...register("gender")}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender ? (
            <p className="text-xs text-destructive">{errors.gender.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Label>
          Photo Upload <span className="text-muted-foreground">(optional)</span>
        </Label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            dragActive ? "border-brand-lime bg-brand-lime/5" : "border-border hover:border-white/30"
          )}
        >
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm text-foreground/90">
            {photoName || "Drag and drop or click to upload"}
          </span>
          <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
