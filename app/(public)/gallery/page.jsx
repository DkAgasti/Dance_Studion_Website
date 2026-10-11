import GalleryHero from "@/components/gallery/GalleryHero";
import PhotoCarouselGallery from "@/components/gallery/PhotoCarouselGallery";
import GalleryQuoteBand from "@/components/gallery/GalleryQuoteBand";

export const metadata = {
  title: "Gallery — ASM Dance Studio",
  description:
    "A visual diary of ASM — studio life, performances, and moments from Bhubaneswar's home of dance and fitness.",
};

export default function GalleryPage() {
  return (
    <>
      <GalleryHero />
      <PhotoCarouselGallery />
      <GalleryQuoteBand />
    </>
  );
}
