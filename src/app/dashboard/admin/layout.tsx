
"use client";

import Link from "next/link";
import {
  Settings,
  LifeBuoy,
  Loader2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { AdminNav } from "../components/admin-nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardMainLayout from "../main-layout";
import { Header } from "@/components/layout/header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const isAdmin = user?.email === 'admin@desa.connect';

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard/warga');
        }
    }, [user, loading, isAdmin, router]);

    if (loading || !user || !isAdmin) {
      return (
          <div className="flex items-center justify-center h-screen">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
    }

  return (
    <div className="flex min-h-screen">
    <Sidebar>
        <SidebarHeader>
        <Logo />
        </SidebarHeader>
        <SidebarContent>
            <AdminNav />
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Pengaturan">
                <Link href="/settings">
                <Settings />
                <span>Pengaturan</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Bantuan">
                <Link href="/help">
                <LifeBuoy />
                <span>Bantuan</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2 p-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                <AvatarFallback>{user.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        </div>
        </SidebarFooter>
    </Sidebar>
     <div className="flex flex-col flex-1">
        <Header />
        <DashboardMainLayout>
            {children}
        </DashboardMainLayout>
    </div>
    </div>
  );
}
