import StoryHero from "@/components/about/StoryHero";
import AsmIntro from "@/components/about/AsmIntro";
import FounderSpotlight from "@/components/about/FounderSpotlight";
import OurValues from "@/components/about/OurValues";
import MeetTheMasters from "@/components/about/MeetTheMasters";
import Milestones from "@/components/about/Milestones";
import StudioGallery from "@/components/about/StudioGallery";
import StatsBand from "@/components/about/StatsBand";
import CTABand from "@/components/shared/CTABand";
import { getStudioSettings } from "@/lib/getStudioSettings";

export const metadata = {
  title: "About Us — ASM Dance Studio",
  description:
    "The story behind Achieve Show Makers — our mission, our founder Trishna, our values, and the milestones that shaped Bhubaneswar's home of dance and fitness.",
};

export default async function AboutPage() {
  const settings = await getStudioSettings();
  const whatsapp = settings.whatsapp;

  return (
    <>
      <StoryHero />
      <AsmIntro />
      <FounderSpotlight />
      <OurValues />
      <MeetTheMasters />
      <Milestones />
      <StudioGallery />
      <StatsBand />
      <CTABand
        title="Come dance with us"
        subtitle="Your next chapter starts on the floor."
        secondaryHref={whatsapp ? `https://wa.me/${whatsapp}` : undefined}
      />
    </>
  );
}
