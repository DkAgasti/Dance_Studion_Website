// Generic platform homepages — used only when the admin hasn't set a real
// account URL, so a social icon still goes somewhere sensible instead of a
// fabricated/likely-wrong "asmdancestudio" guess.
export const PLATFORM_HOME = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
};

// lucide-react dropped brand/logo marks, so these are hand-drawn to match
// the real Instagram/Facebook/YouTube/X marks. Shared by Footer.jsx and
// SocialRow.jsx so both places render identical icons.
export function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5H16l.5-3.5h-3V7.8c0-1 .3-1.7 1.7-1.7H16.6V3.1C16.3 3.1 15.3 3 14.2 3c-2.4 0-4 1.5-4 4.1V10H7.7v3.5h2.5V21h3.3z" />
    </svg>
  );
}

export function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22 12s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.5c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.5c.9-.2 1.6-.9 1.8-1.8C22 15.2 22 12 22 12z" />
      <path d="M10 15.2V8.8L15.5 12 10 15.2z" fill="#0f0f10" />
    </svg>
  );
}

export function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 3h3.1l-6.8 7.8L23 21h-6.3l-4.9-6.4L6.2 21H3.1l7.3-8.3L2.5 3h6.4l4.4 5.9L18.9 3zm-1.1 16h1.7L7.3 4.9H5.5L17.8 19z" />
    </svg>
  );
}
