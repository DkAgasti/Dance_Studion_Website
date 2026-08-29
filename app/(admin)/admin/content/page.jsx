"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentTabs from "@/components/admin/content/ContentTabs";
import ReelsTab from "@/components/admin/content/ReelsTab";
import PhotosTab from "@/components/admin/content/PhotosTab";
import TestimonialsTab from "@/components/admin/content/TestimonialsTab";
import TrainersTab from "@/components/admin/content/TrainersTab";
import ServicesTab from "@/components/admin/content/ServicesTab";
import MilestonesTab from "@/components/admin/content/MilestonesTab";
import AnnouncementsTab from "@/components/admin/content/AnnouncementsTab";
import { CONTENT_TABS } from "@/components/admin/content/contentData";

// Tabs whose "Add New" affordance is a dialog we can trigger via ref.
const ADD_LABEL = {
  reels: "Add Reel",
  photos: null,
  testimonials: "Add Testimonial",
  trainers: "Add Trainer",
  services: "Add Service",
  milestones: "Add Milestone",
  announcements: null,
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState("reels");
  const reelsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const trainersRef = useRef(null);
  const servicesRef = useRef(null);
  const milestonesRef = useRef(null);

  const refByTab = {
    reels: reelsRef,
    testimonials: testimonialsRef,
    trainers: trainersRef,
    services: servicesRef,
    milestones: milestonesRef,
  };

  const addLabel = ADD_LABEL[activeTab];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage what shows on your website.
          </p>
        </div>
        {addLabel ? (
          <Button
            className="w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90"
            onClick={() => refByTab[activeTab]?.current?.openAdd()}
          >
            <Plus className="size-4" />
            {addLabel}
          </Button>
        ) : null}
      </div>

      <ContentTabs tabs={CONTENT_TABS} active={activeTab} onChange={setActiveTab} />

      {/* All tabs stay mounted (just hidden) so switching tabs doesn't lose
          in-progress edits like photo reordering or a half-filled form. */}
      <div className="pt-2">
        <div className={activeTab === "reels" ? "" : "hidden"}>
          <ReelsTab ref={reelsRef} />
        </div>
        <div className={activeTab === "photos" ? "" : "hidden"}>
          <PhotosTab />
        </div>
        <div className={activeTab === "testimonials" ? "" : "hidden"}>
          <TestimonialsTab ref={testimonialsRef} />
        </div>
        <div className={activeTab === "trainers" ? "" : "hidden"}>
          <TrainersTab ref={trainersRef} />
        </div>
        <div className={activeTab === "services" ? "" : "hidden"}>
          <ServicesTab ref={servicesRef} />
        </div>
        <div className={activeTab === "milestones" ? "" : "hidden"}>
          <MilestonesTab ref={milestonesRef} />
        </div>
        <div className={activeTab === "announcements" ? "" : "hidden"}>
          <AnnouncementsTab />
        </div>
      </div>
    </div>
  );
}
