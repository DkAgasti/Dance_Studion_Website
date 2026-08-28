import ContactForm from "@/components/forms/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

// Two-column layout: contact form left, studio details right.
export default function ContactSection() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </section>
  );
}
