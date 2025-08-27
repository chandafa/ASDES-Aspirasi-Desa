"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Overview } from "../components/overview";
import { RecentReports } from "../components/recent-reports";
import { reports } from "@/lib/data";
import { useAuth } from "@/components/providers/auth-provider";

export default function WargaDashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  // Note: Data is still mocked. In a real app, you'd fetch this based on user.uid
  const userReports = reports.filter(r => r.createdBy === 'warga01');

  const stats = {
    total: userReports.length,
    pending: userReports.filter(r => r.status === 'pending').length,
    resolved: userReports.filter(r => r.status === 'resolved').length,
    rejected: userReports.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Dashboard Warga</h1>
                <p className="text-muted-foreground">Selamat datang kembali, {user.displayName || user.email}!</p>
            </div>
            <Button asChild>
                <Link href="/report/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajukan Laporan Baru
                </Link>
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laporan Diproses</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laporan Selesai</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.resolved}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laporan Ditolak</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.rejected}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Statistik Laporan Anda</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Overview />
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Laporan Terbaru</CardTitle>
                    <CardDescription>
                        Anda telah membuat {stats.total} laporan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentReports />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
