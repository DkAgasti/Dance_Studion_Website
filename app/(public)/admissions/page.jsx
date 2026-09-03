import { Suspense } from "react";
import AdmissionForm from "@/components/forms/AdmissionForm";

export const metadata = {
  title: "Admissions — ASM Dance Studio",
  description:
    "Enroll at ASM Dance Studio — student details, class and plan selection, all in one quick form.",
};

export default function AdmissionsPage() {
  return (
    <div className="container-page flex justify-center pt-[calc(var(--header-h,88px)+24px)] pb-16">
      <Suspense fallback={null}>
        <AdmissionForm />
      </Suspense>
    </div>
  );
}
