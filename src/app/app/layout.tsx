"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { useI18n } from "@/lib/i18n/context";
import AppBottomNav from "./components/AppBottomNav";
import InstallBanner from "./components/InstallBanner";
import { registerServiceWorker } from "@/lib/push-notifications";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        {children}
        <InstallBanner />
        <AppBottomNav />
      </div>
    </AuthProvider>
  );
}
