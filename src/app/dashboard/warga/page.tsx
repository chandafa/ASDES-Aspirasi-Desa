"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, Newspaper, Bell, FileClock, ArrowRight, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { reports, blogPosts } from "@/lib/data";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";


export default function WargaDashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  // Note: Data is still mocked. In a real app, you'd fetch this based on user.uid
  const userReports = reports.filter(r => r.createdBy === 'warga01');
  const latestReport = userReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const latestBlogPost = blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];


  const stats = {
    total: userReports.length,
    pending: userReports.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    resolved: userReports.filter(r => r.status === 'resolved').length,
    rejected: userReports.filter(r => r.status === 'rejected').length,
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'resolved': return 'default';
        case 'in_progress': return 'secondary';
        case 'pending': return 'outline';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  };

  const getStatusClass = (status: string) => {
      switch (status) {
          case 'resolved': return 'bg-green-100 text-green-800';
          case 'in_progress': return 'bg-yellow-100 text-yellow-800';
          case 'pending': return 'bg-blue-100 text-blue-800';
          case 'rejected': return 'bg-red-100 text-red-800';
          default: return '';
      }
  }


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
        
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <LifeBuoy className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Baru di Aspirasi Desa?</CardTitle>
                        <CardDescription>Pelajari cara membuat laporan dan menggunakan fitur lainnya melalui pusat bantuan kami.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardFooter>
                <Button asChild variant="outline" className="ml-auto">
                    <Link href="/help">
                        Lihat Pusat Bantuan
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Laporan Saya</CardTitle>
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

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <FileClock className="h-6 w-6 text-primary" />
                    <CardTitle>Status Laporan Terakhir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {latestReport ? (
                        <div>
                            <h3 className="font-semibold">{latestReport.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{latestReport.description}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span>Status:</span>
                                <Badge variant={getStatusVariant(latestReport.status)} className={cn(getStatusClass(latestReport.status))}>
                                    {latestReport.status}
                                </Badge>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">Anda belum membuat laporan.</p>
                    )}
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Bell className="h-6 w-6 text-primary" />
                    <CardTitle>Notifikasi / Update Desa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                            <Newspaper className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Blog Baru Diterbitkan</p>
                            <p className="text-xs text-muted-foreground">Pemasangan Lampu Jalan Tenaga Surya...</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <div className="bg-green-100 text-green-700 p-2 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Laporan Selesai</p>
                            <p className="text-xs text-muted-foreground">Jalan berlubang di depan balai desa...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Newspaper className="h-6 w-6 text-primary" />
                    <CardTitle>Artikel Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                   {latestBlogPost ? (
                        <Link href={`/blog/${latestBlogPost.slug}`} className="group space-y-2 block">
                             <Image
                                data-ai-hint="village news"
                                src={latestBlogPost.coverImage}
                                alt={latestBlogPost.title}
                                width={400}
                                height={200}
                                className="rounded-md object-cover aspect-video"
                            />
                            <h3 className="font-semibold group-hover:underline">{latestBlogPost.title}</h3>
                            <p className="text-xs text-muted-foreground">{new Date(latestBlogPost.publishedAt).toLocaleDateString()}</p>
                        </Link>
                   ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">Belum ada artikel.</p>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
