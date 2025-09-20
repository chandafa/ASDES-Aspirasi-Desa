"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  FileText,
  Users,
  FilePen,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard Admin" isActive={pathname.startsWith('/dashboard/admin') && !pathname.includes('/reports') && !pathname.includes('/users') && !pathname.includes('/blog')}>
          <Link href="/dashboard/admin">
            <Shield />
            <span>Dashboard Admin</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Kelola Laporan" isActive={pathname.startsWith('/dashboard/admin/reports')}>
          <Link href="/dashboard/admin/reports">
            <FileText />
            <span>Kelola Laporan</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Kelola Pengguna" isActive={pathname.startsWith('/dashboard/admin/users')}>
          <Link href="/dashboard/admin/users">
            <Users />
            <span>Kelola Pengguna</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Kelola Blog" isActive={pathname.startsWith('/dashboard/admin/blog')}>
          <Link href="/dashboard/admin/blog">
            <FilePen />
            <span>Kelola Blog</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
