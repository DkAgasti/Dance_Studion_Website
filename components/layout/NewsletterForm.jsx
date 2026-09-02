"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Footer email signup — posts to /api/newsletter without a page reload.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-brand-lime">
        <Check className="size-4" />
        You&apos;re subscribed — thanks!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="h-[57px] rounded-full border border-border bg-white/[0.05] px-6 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <Button type="submit" disabled={status === "submitting"} className="h-14 rounded-full font-bold">
        {status === "submitting" ? "Subscribing..." : "Subscribe Now"}
      </Button>
    </form>
  );
}
