"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/lib/supabase/auth-context";
import AppBottomNav from "./components/AppBottomNav";
import AppHamburgerMenu from "./components/AppHamburgerMenu";
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
        <AppHamburgerMenu />
        <InstallBanner />
        <AppBottomNav />
      </div>
    </AuthProvider>
  );
}
