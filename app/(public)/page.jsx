import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Stats from "@/components/home/Stats";
import StyleGrid from "@/components/home/StyleGrid";
import EliteFitness from "@/components/home/EliteFitness";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Founder from "@/components/home/Founder";
import ReelsCarousel from "@/components/home/ReelsCarousel";
import Reviews from "@/components/home/Reviews";
import CTABand from "@/components/shared/CTABand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <StyleGrid />
      <EliteFitness />
      <WhyChooseUs />
      <Founder />
      <ReelsCarousel />
      <Reviews />
      <CTABand className="pt-2 md:pt-12" />
    </>
  );
}
