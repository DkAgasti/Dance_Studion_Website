import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import ContactMap from "@/components/contact/ContactMap";
import SocialRow from "@/components/contact/SocialRow";

export const metadata = {
  title: "Contact Us — ASM Dance Studio",
  description:
    "Get in touch with ASM Dance Studio — questions about classes, pricing, or performances, we're here to help.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
      <ContactMap />
      <SocialRow />
    </>
  );
}
