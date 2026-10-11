import FitnessHero from "@/components/fitness/FitnessHero";
import ServicesList from "@/components/fitness/ServicesList";
import CorporateForm from "@/components/fitness/CorporateForm";
import CTABand from "@/components/shared/CTABand";

export const metadata = {
  title: "Fitness & Wellness Services — ASM Dance Studio",
  description:
    "Zumba & Aerobics, Yoga, Kickboxing & MMA, and Corporate Wellness — fitness programs that keep you strong on and off the dance floor.",
};

export default function FitnessPage() {
  return (
    <>
      <FitnessHero />
      <ServicesList />
      <CorporateForm />
      <CTABand
        title="Fitness with flavor."
        subtitle="No boring reps — just movement that feels like a reward, not a chore."
      />
    </>
  );
}
