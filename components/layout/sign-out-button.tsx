"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-red-50 transition-all group"
    >
      <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
        <LogOut className="h-4 w-4 text-red-500" />
      </div>
      <span className="text-red-500 group-hover:text-red-600">Sign out</span>
    </button>
  );
}
