import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login — ASM Dance Studio",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="bg-gradient-brand pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[120px]"
      />

      <div className="glass-strong relative w-full max-w-sm rounded-3xl p-8">
        <div className="flex flex-col items-center text-center">
          <span className="bg-gradient-brand flex size-12 items-center justify-center rounded-full font-display text-lg font-bold text-white">
            A
          </span>
          <h1 className="font-display mt-4 text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage ASM Dance Studio.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
