// Single source of truth for studio NAP (name/address/phone), nav links, and social profiles.
export const siteConfig = {
  name: "ASM Dance Studio",
  fullName: "Achieve Show Makers",
  tagline: "Where every rhythm finds a home.",
  description:
    "Bhubaneswar's premier destination for dance and fitness excellence.",
  url: "https://asmdancestudio.com",
  phone: "+91 79785 79382",
  whatsapp: "917978579382",
  email: "hello@asmdancestudio.com",
  address: {
    line1: "Room-6, 2nd Floor, BMC Panchadeep Complex, Bhauma Nagara, Unit-4",
    city: "Bhubaneswar",
    state: "Odisha",
    zip: "751001",
    full: "Room-6, 2nd Floor, BMC Panchadeep Complex, Bhauma Nagara, Unit-4, Bhubaneswar, Khorda-751001",
  },
  hours: {
    weekdays: "Mon - Sat: 06:00 AM - 09:00 PM",
    weekend: "Sun: 08:00 AM - 12:00 PM (Workshops only)",
  },
  navLinks: [
    { label: "About", href: "/about" },
    { label: "Classes", href: "/classes" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    { label: "Our Classes", href: "/classes" },
    { label: "Fitness Programs", href: "/services" },
    { label: "Meet Trainers", href: "/about#trainers" },
    { label: "Membership Plans", href: "/pricing" },
    { label: "Gallery", href: "/gallery" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  socials: {
    instagram: "https://instagram.com/asmdancestudio",
    facebook: "https://facebook.com/asmdancestudio",
    youtube: "https://youtube.com/@asmdancestudio",
    twitter: "https://x.com/asmdancestudio",
  },
};
