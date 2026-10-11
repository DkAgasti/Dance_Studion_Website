import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Injects Cloudinary's f_auto,q_auto (best format + quality for the
// requesting browser) into a raw Cloudinary image URL. No-op for anything
// else, so it's safe to call on any src.
export function cldOptimize(url) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

// Google's "Embed a map" panel gives a full <iframe> snippet, but every
// caller here (settings form, DB column, Footer's <iframe src>) needs just
// the bare URL. Handles a full <iframe src="...">, a bare src="..."
// fragment, or a clean/partial paste that starts mid-URL and trails into
// the other attributes (e.g. `https://...!2sin" width="600" ...`) — finds
// the http(s) URL wherever it starts and cuts it off at the first quote or
// whitespace, since a real embed URL never contains either.
export function extractMapEmbedUrl(value) {
  if (!value) return value;
  const trimmed = value.trim();
  const iframeMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeMatch) return iframeMatch[1];
  const urlMatch = trimmed.match(/https?:\/\/\S+/);
  if (!urlMatch) return trimmed;
  return urlMatch[0].split(/["'\s]/)[0];
}
