"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";
import { Toaster } from "@/components/ui/sonner";

// Owns the mobile sidebar-drawer open/close state shared between the
// sidebar itself and the topbar's menu button.
export default function AdminShell({ children, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} user={user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
