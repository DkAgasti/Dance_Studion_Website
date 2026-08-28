"use client";

import { User, Users } from "lucide-react";
import StepHeading from "@/components/forms/trial/StepHeading";
import OptionCard from "@/components/forms/trial/OptionCard";

export default function StepWhoFor({ value, onChange }) {
  return (
    <div>
      <StepHeading
        step={1}
        total={6}
        title="Let's get you on the floor."
        subtitle="Tell us who is booking the trial class to ensure we tailor the experience perfectly."
      />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <OptionCard
          icon={User}
          title="Just Me"
          description="I'm booking this trial for myself."
          selected={value === "myself"}
          onClick={() => onChange("myself")}
        />
        <OptionCard
          icon={Users}
          title="Someone Else"
          description="I'm booking for a child or friend."
          selected={value === "someone-else"}
          onClick={() => onChange("someone-else")}
        />
      </div>
    </div>
  );
}
