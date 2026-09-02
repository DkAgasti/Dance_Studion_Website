"use client";

import { useRouter } from "next/navigation";

// Closing a form that might be rendered either as a real page (direct visit)
// or as an intercepted-route modal (opened from another page) should always
// mean "go back to wherever I came from" — router.back() does that in both
// cases, restoring the underlying page's scroll position when it's a modal.
// Falls back to "/" only when there's no history to go back to.
export function useCloseRoute() {
  const router = useRouter();

  return function closeRoute() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
}
