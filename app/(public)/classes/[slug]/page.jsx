import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ClassHero from "@/components/classes/ClassHero";
import BatchTable from "@/components/classes/BatchTable";
import ClassMentor from "@/components/classes/ClassMentor";
import CTABand from "@/components/shared/CTABand";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const classItem = await prisma.danceClass.findUnique({ where: { slug } });
  if (!classItem) return {};

  return {
    title: `${classItem.name} Classes — ASM Dance Studio`,
    description: classItem.description ?? undefined,
  };
}

export default async function ClassDetailPage({ params }) {
  const { slug } = await params;
  const classItem = await prisma.danceClass.findUnique({
    where: { slug },
    include: {
      batches: {
        include: { trainer: true, students: { select: { id: true } } },
      },
    },
  });

  if (!classItem) notFound();

  const batches = classItem.batches.map((b) => ({
    day: b.day,
    time: b.startTime,
    trainer: b.trainer?.name ?? "TBA",
    seats: Math.max(0, b.capacity - b.students.length),
    price: b.price ?? 0,
  }));

  const mentor = classItem.batches.find((b) => b.trainer)?.trainer ?? null;

  return (
    <>
      <ClassHero classItem={classItem} />

      {/* Slides up and over the sticky hero as the page scrolls. */}
      <div className="relative z-10 bg-background">
        <BatchTable batches={batches} />
        <ClassMentor trainer={mentor} />
        <CTABand
          title="Start your journey today."
          subtitle={`Join the ${classItem.name} program and take the floor.`}
          secondaryHref={`https://wa.me/${siteConfig.whatsapp}`}
        />
      </div>
    </>
  );
}
