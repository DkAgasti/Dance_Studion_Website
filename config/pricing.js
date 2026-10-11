// Display-only pricing plans (no online payment integration yet).
// quarterlyPrice is the effective per-month rate when billed quarterly
// (10% off monthlyPrice) — shown as "/month" either way, toggle just swaps
// which field is displayed.
export const pricingPlans = [
  {
    slug: "kids-special",
    name: "Kids Special",
    tagline: "Perfect for little stars aged 4-10. Developing rhythm and joy.",
    monthlyPrice: 2000,
    quarterlyPrice: 1800,
    features: [
      "2 Classes / Week",
      "Beginner Friendly",
      "Creative Movement",
      "Quarterly Performance",
    ],
    highlighted: false,
    ctaLabel: "Enroll Now",
  },
  {
    slug: "standard",
    name: "Standard",
    tagline: "For the consistent learner. Any age, any single style mastery.",
    monthlyPrice: 2800,
    quarterlyPrice: 2520,
    features: [
      "3 Classes / Week",
      "Any 1 Dance Style",
      "Studio Practice Access",
      "Workshop Discounts",
      "Monthly Feedback",
    ],
    highlighted: true,
    ctaLabel: "Enroll Now",
  },
  {
    slug: "unlimited-pro",
    name: "Unlimited Pro",
    tagline: "The ultimate package for the aspiring professional performer.",
    monthlyPrice: 4500,
    quarterlyPrice: 4050,
    features: [
      "Unlimited Classes",
      "All Styles + Fitness",
      "Personal Mentorship",
      "Profile Photography",
      "Performance Gigs",
    ],
    highlighted: false,
    ctaLabel: "Enroll Now",
  },
];
