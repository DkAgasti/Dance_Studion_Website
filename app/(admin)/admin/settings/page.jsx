"use client";

import { useState } from "react";
import SettingsNav from "@/components/admin/settings/SettingsNav";
import StudioProfileSection from "@/components/admin/settings/StudioProfileSection";
import SocialMapSection from "@/components/admin/settings/SocialMapSection";
import PlansPricingSection from "@/components/admin/settings/PlansPricingSection";
import NotificationsSection from "@/components/admin/settings/NotificationsSection";
import TeamRolesSection from "@/components/admin/settings/TeamRolesSection";
import BrandingSection from "@/components/admin/settings/BrandingSection";

const SECTION_COMPONENTS = {
  profile: StudioProfileSection,
  social: SocialMapSection,
  plans: PlansPricingSection,
  notifications: NotificationsSection,
  team: TeamRolesSection,
  branding: BrandingSection,
};

export default function AdminSettingsPage() {
  const [active, setActive] = useState("profile");
  const ActiveSection = SECTION_COMPONENTS[active];

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 -mx-6 border-b border-border bg-background/95 px-6 py-4 backdrop-blur-md md:-mx-8 md:px-8">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsNav active={active} onChange={setActive} />
        <div className="min-w-0 flex-1">
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
