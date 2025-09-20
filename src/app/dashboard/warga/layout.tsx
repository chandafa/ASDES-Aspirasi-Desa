
"use client";

import Link from "next/link";
import {
  Settings,
  LifeBuoy,
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
import { WargaNav } from "../components/warga-nav";

export default function WargaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user } = useAuth();
    
    if (!user) return null;

  return (
    <div className="flex min-h-screen">
    <Sidebar className="pt-16">
        <SidebarHeader>
        {/* <Logo /> */}
        </SidebarHeader>
        <SidebarContent>
            <WargaNav />
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
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
    </main>
    </div>
  );
}
