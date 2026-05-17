"use client";

import { AuthProvider } from "@/lib/supabase/auth-context";
import { useI18n } from "@/lib/i18n/context";
import AppBottomNav from "./components/AppBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        {children}
        <AppBottomNav />
      </div>
    </AuthProvider>
  );
}
