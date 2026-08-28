// Refreshes the Supabase auth session cookie; called from the root proxy.js
// (Next.js 16 renamed middleware.js -> proxy.js, same mechanism).
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Revalidates the session with Supabase (not just decoding the cookie),
  // so a signed-out/expired user is caught here rather than downstream.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
