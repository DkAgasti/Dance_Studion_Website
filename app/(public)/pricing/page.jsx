import PricingHero from "@/components/pricing/PricingHero";
import PricingPlans from "@/components/pricing/PricingPlans";
import FlexibleOptions from "@/components/pricing/FlexibleOptions";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import CTABand from "@/components/shared/CTABand";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Pricing — ASM Dance Studio",
  description:
    "Simple, honest pricing for every dancer — Kids Special, Standard, and Unlimited Pro plans, plus drop-in classes, 1-on-1 sessions, and studio rentals.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingPlans />
      <FlexibleOptions />
      <PricingFAQ />
      <CTABand
        title="Invest in your art."
        subtitle={null}
        secondaryHref={`https://wa.me/${siteConfig.whatsapp}`}
      />
    </>
  );
}
