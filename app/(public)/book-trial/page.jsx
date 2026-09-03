import TrialWizard from "@/components/forms/TrialWizard";

export const metadata = {
  title: "Book a Free Trial — ASM Dance Studio",
  description:
    "Book your free trial class in a few quick steps — pick a style, a time that works, and we'll take it from there.",
};

export default function BookTrialPage() {
  return (
    <div className="container-page flex justify-center pt-[calc(var(--header-h,88px)+24px)] pb-16">
      <TrialWizard />
    </div>
  );
}
