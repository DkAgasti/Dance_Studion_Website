import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ClassHero from "@/components/classes/ClassHero";
import AboutClass from "@/components/classes/AboutClass";
import BatchTable from "@/components/classes/BatchTable";
import ClassMentor from "@/components/classes/ClassMentor";
import ClassGallery from "@/components/classes/ClassGallery";
import ClassFAQs from "@/components/classes/ClassFAQs";
import CTABand from "@/components/shared/CTABand";
import { getStudioSettings } from "@/lib/getStudioSettings";

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

  const settings = await getStudioSettings();
  const whatsapp = settings.whatsapp;

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
        <AboutClass classItem={classItem} batches={batches} />
        <BatchTable batches={batches} />
        <ClassMentor trainer={mentor} />
        <ClassGallery images={classItem.galleryImages} />
        <ClassFAQs faqs={classItem.faqs ?? []} />
        <CTABand
          title="Start your journey today."
          subtitle={`Join the ${classItem.name} program and take the floor.`}
          secondaryHref={whatsapp ? `https://wa.me/${whatsapp}` : undefined}
        />
      </div>
    </>
  );
}
