"use server";

// Auth helpers — current user/session lookup, backed by Supabase Auth +
// the AdminUser table (role-gated access to /admin). getCurrentUser()/
// requireAdmin() are the seam the rest of the app calls through.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) return null;

  const adminUser = await prisma.adminUser.findUnique({ where: { email: authUser.email } });
  if (!adminUser?.active) return null;

  return adminUser;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
