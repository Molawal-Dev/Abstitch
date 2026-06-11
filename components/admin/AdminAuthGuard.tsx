"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();
      if (!profile) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-burgundy-800 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-gray-500">Checking access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
