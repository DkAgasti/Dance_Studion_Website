"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClassFilters from "@/components/classes/ClassFilters";
import ClassCard from "@/components/classes/ClassCard";

const GRADIENTS = [
  "from-[#5b2a1f] via-surface to-[#c9862c]",
  "from-[#1c1140] via-surface to-[#6d3bd1]",
  "from-[#0f2a3a] via-surface to-[#1d7a8c]",
  "from-[#3a0f1f] via-surface to-[#b0203f]",
  "from-[#0f3a34] via-surface to-[#3ecf8e]",
  "from-[#3a2a1f] via-surface to-[#7a5320]",
];

// Filter chips (age + style) and the responsive class card grid. Classes
// are fetched server-side (see app/(public)/classes/page.jsx) and passed in
// as `initialClasses` — whatever the admin adds (Admin > Classes) is what
// shows up here.
export default function ClassesGrid({ initialClasses = [] }) {
  const classes = initialClasses;
  const [age, setAge] = useState("all");
  const [style, setStyle] = useState("all");

  // "All Ages" is a per-class sentinel meaning "matches every age filter" —
  // it isn't a distinct filter chip alongside "All" (see isAgeMatch below).
  const ageOptions = useMemo(() => {
    const ages = Array.from(
      new Set(classes.map((c) => c.ageGroup).filter((a) => a && a !== "All Ages"))
    );
    return [{ key: "all", label: "All" }, ...ages.map((a) => ({ key: a, label: a }))];
  }, [classes]);

  const styleOptions = useMemo(
    () => [{ key: "all", label: "All" }, ...classes.map((c) => ({ key: c.id, label: c.name }))],
    [classes]
  );

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        const ageMatch =
          age === "all" || !c.ageGroup || c.ageGroup === "All Ages" || c.ageGroup === age;
        const styleMatch = style === "all" || c.id === style;
        return ageMatch && styleMatch;
      }),
    [classes, age, style]
  );

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "90px" }}
        transition={{ duration: 0.35 }}
      >
        <ClassFilters
          age={age}
          style={style}
          onAgeChange={setAge}
          onStyleChange={setStyle}
          ageOptions={ageOptions}
          styleOptions={styleOptions}
        />
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((classItem, i) => (
            <ClassCard
              key={classItem.slug}
              classItem={classItem}
              gradient={GRADIENTS[i % GRADIENTS.length]}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          {classes.length
            ? "No classes match those filters yet — try a different combination."
            : "Classes coming soon — check back shortly."}
        </p>
      ) : null}
    </section>
  );
}
