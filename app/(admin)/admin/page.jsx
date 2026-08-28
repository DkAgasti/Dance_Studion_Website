import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsGrid from "@/components/admin/StatsGrid";
import { RevenueChart, EnrollmentChart } from "@/components/admin/Charts";
import RecentAdmissions from "@/components/admin/RecentAdmissions";
import UpcomingTrials from "@/components/admin/UpcomingTrials";
import { getDashboardData } from "@/lib/dashboard";

export const metadata = {
  title: "Overview — ASM Admin",
};

export default async function AdminOverviewPage() {
  const { stats, revenueByMonth, enrollmentByStyle, recentAdmissions, upcomingTrials } =
    await getDashboardData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s what&apos;s happening at ASM today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-full border-border">
            <Download className="size-4" />
            Export Report
          </Button>
          <Button className="gap-2 rounded-full bg-brand-start text-white hover:bg-brand-start/90">
            <Plus className="size-4" />
            New Booking
          </Button>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="glass-tile rounded-2xl p-6 xl:col-span-2">
          <h3 className="font-medium">Revenue Growth</h3>
          <div className="mt-4">
            <RevenueChart data={revenueByMonth} />
          </div>
        </div>
        <div className="glass-tile rounded-2xl p-6">
          <h3 className="font-medium">Enrollment by Class</h3>
          <div className="mt-4">
            <EnrollmentChart data={enrollmentByStyle} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentAdmissions admissions={recentAdmissions} />
        <UpcomingTrials trials={upcomingTrials} />
      </div>
    </div>
  );
}
