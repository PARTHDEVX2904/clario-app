import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = (user?.user_metadata?.full_name as string | undefined) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={user?.email ?? null} userName={userName} />
      <div className="md:pl-60">
        {children}
      </div>
    </div>
  );
}
