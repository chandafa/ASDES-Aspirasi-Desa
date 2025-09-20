"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users, reports, blogPosts } from "@/lib/data";
import { FileText, Users, Newspaper, CheckCircle, Trophy } from "lucide-react";
import { Overview } from "../components/overview";
import { RecentReports } from "../components/recent-reports";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboard() {
  const adminUser = users.find(u => u.role === 'admin');

  const stats = {
    totalReports: reports.length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    totalUsers: users.filter(u => u.role === 'warga').length,
    totalPosts: blogPosts.length,
  };

  const activeUsers = users
    .filter(u => u.role === 'warga')
    .map(user => ({
        ...user,
        reportCount: reports.filter(r => r.createdBy === user.uid).length
    }))
    .sort((a, b) => b.reportCount - a.reportCount)
    .slice(0, 3);


  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Dashboard Admin</h1>
            <p className="text-muted-foreground">Selamat datang, {adminUser?.name}. Kelola semua aspek dari sini.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalReports}</div>
                    <p className="text-xs text-muted-foreground">Laporan dari seluruh warga</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laporan Selesai</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.resolvedReports}</div>
                    <p className="text-xs text-muted-foreground">Dari total {stats.totalReports} laporan</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                     <p className="text-xs text-muted-foreground">Akun warga yang terdaftar</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Artikel Blog</CardTitle>
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                    <p className="text-xs text-muted-foreground">Artikel yang telah dipublikasikan</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Statistik Laporan</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Overview />
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Laporan Terbaru</CardTitle>
                    <CardDescription>
                        Total ada {stats.totalReports} laporan di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentReports />
                </CardContent>
            </Card>
             <Card className="col-span-4 lg:col-span-7">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <CardTitle>Warga Paling Aktif</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    {activeUsers.map((user, index) => (
                         <div key={user.uid} className="flex items-center gap-4">
                            <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.reportCount} Laporan</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
