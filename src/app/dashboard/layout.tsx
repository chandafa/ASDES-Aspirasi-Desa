
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

// This is a mock function, replace with your actual role checking logic
const isAdminUser = (email?: string | null) => {
    return email === 'admin@desa.connect';
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isAdmin = isAdminUser(user?.email);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
            return;
        }

        if (!loading && user) {
            const isAdminPage = pathname.startsWith('/dashboard/admin');
            const isWargaPage = pathname.startsWith('/dashboard/warga');

            if (isAdmin && !isAdminPage) {
                router.push('/dashboard/admin');
            } else if (!isAdmin && !isWargaPage) {
                router.push('/dashboard/warga');
            }
        }

    }, [user, loading, router, isAdmin, pathname]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

  return (
    <SidebarProvider>
        {children}
    </SidebarProvider>
  );
}
