"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import Chip from "@/components/forms/trial/Chip";

const EXPERIENCE_LEVELS = [
  { key: "beginner", label: "Beginner", description: "New to this style" },
  { key: "intermediate", label: "Intermediate", description: "Some training" },
  { key: "advanced", label: "Advanced", description: "Years of practice" },
];

const AGE_GROUPS = [
  { key: "kids", label: "Kids", description: "Ages 5-12" },
  { key: "teens", label: "Teens", description: "Ages 13-19" },
  { key: "adults", label: "Adults", description: "Ages 20+" },
];

export default function StepExperience({
  experienceLevel,
  ageGroup,
  onExperienceChange,
  onAgeChange,
}) {
  return (
    <div>
      <StepHeading
        step={2}
        total={6}
        title="Tell us a bit more."
        subtitle="This helps us place you in the right batch."
      />

      <div className="mt-8">
        <p className="eyebrow">Experience Level</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <Chip
              key={level.key}
              label={level.label}
              description={level.description}
              selected={experienceLevel === level.key}
              onClick={() => onExperienceChange(level.key)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="eyebrow">Age Group</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {AGE_GROUPS.map((age) => (
            <Chip
              key={age.key}
              label={age.label}
              description={age.description}
              selected={ageGroup === age.key}
              onClick={() => onAgeChange(age.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
