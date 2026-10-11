import AdminShell from "@/components/layout/AdminShell";
import { requireAdmin } from "@/lib/auth";

// Admin dashboard layout — sidebar, topbar, and auth guard for /admin routes.
// Redirects to /login when there's no session or matching AdminUser (see lib/auth.js).
export default async function AdminLayout({ children }) {
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}
