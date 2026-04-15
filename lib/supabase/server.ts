import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

function makeCookieMethods(): CookieMethodsServer {
  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  const init = async () => {
    cookieStore = await cookies();
  };
  // We call this synchronously inside the factory below after awaiting
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(
          ({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
        );
      } catch {
        // Server Component — cookie setting may fail, acceptable
      }
    },
  };
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(
                name,
                value,
                options as Parameters<typeof cookieStore.set>[2]
              )
            );
          } catch {
            // Server Component — acceptable
          }
        },
      },
    }
  );
}

// Service role client for server-side operations that bypass RLS.
// No Database generic — our API routes handle their own type mapping explicitly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createServiceClient(): Promise<ReturnType<typeof createServerClient<any>>> {
  const cookieStore = await cookies();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(
                name,
                value,
                options as Parameters<typeof cookieStore.set>[2]
              )
            );
          } catch {
            // Server Component — acceptable
          }
        },
      },
    }
  );
}
