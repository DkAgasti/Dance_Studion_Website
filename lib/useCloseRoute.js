"use client";

import { useRouter } from "next/navigation";

// Closing the standalone /book-trial or /admissions page always sends the
// user to the homepage so shared-link visitors stay on the site.
export function useCloseRoute() {
  const router = useRouter();

  return function closeRoute() {
    router.push("/");
  };
}
