"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  FileText,
  Newspaper,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function WargaNav() {
  const pathname = usePathname();
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard/warga'}>
          <Link href="/dashboard/warga">
            <Home />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Peta Masalah" isActive={pathname.startsWith('/dashboard/warga/map')}>
          <Link href="/dashboard/warga/map">
            <Map />
            <span>Peta Masalah</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Laporan Saya" isActive={pathname.startsWith('/dashboard/warga/reports')}>
          <Link href="/dashboard/warga/reports">
            <FileText />
            <span>Laporan Saya</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
