import ClassesHero from "@/components/classes/ClassesHero";
import ClassesGrid from "@/components/classes/ClassesGrid";
import NotSureCTA from "@/components/classes/NotSureCTA";
import ClassesFAQ from "@/components/classes/ClassesFAQ";
import { getPublicClasses } from "@/lib/classes";

// Revalidate periodically so a class the admin just added/edited shows up
// within a minute, instead of only at the next deploy.
export const revalidate = 60;

export const metadata = {
  title: "Dance Classes — ASM Dance Studio",
  description:
    "Explore ASM's full range of dance classes — Classical, Contemporary, Hip-Hop, Jazz, Kids, Lyrical, Modern, Zumba and more — for every age and skill level.",
};

export default async function ClassesPage() {
  const classes = await getPublicClasses();

  return (
    <>
      <ClassesHero />
      <ClassesGrid initialClasses={classes} />
      <NotSureCTA />
      <ClassesFAQ />
    </>
  );
}
