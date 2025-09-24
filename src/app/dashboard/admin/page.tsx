
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Newspaper, CheckCircle, Trophy, Loader2 } from "lucide-react";
import { Overview } from "../components/overview";
import { RecentReports } from "../components/recent-reports";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import type { Report, User, BlogPost } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { Timestamp } from "firebase/firestore";


export default function AdminDashboard() {
  const { user: adminUser } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    totalUsers: 0,
    totalPosts: 0,
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all reports
        const reportsCollection = collection(db, 'reports');
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportsData = reportsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            } as Report;
        });
        setReports(reportsData);

        // Fetch all users
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            } as User
        });
        setAllUsers(usersData);

        // Fetch all blog posts
        const blogPostsCollection = collection(db, 'blogPosts');
        const blogPostsSnapshot = await getDocs(blogPostsCollection);
        const blogPostsData = blogPostsSnapshot.docs.map(doc => doc.data() as BlogPost);

        // Calculate stats
        setStats({
          totalReports: reportsData.length,
          resolvedReports: reportsData.filter(r => r.status === 'resolved').length,
          totalUsers: usersData.filter(u => u.role === 'warga').length,
          totalPosts: blogPostsData.length,
        });

        // Calculate active users
        const wargaUsers = usersData.filter(u => u.role === 'warga');
        const usersWithReportCount = wargaUsers.map(user => ({
            ...user,
            reportCount: reportsData.filter(r => r.createdBy === user.uid).length
        }));
        
        usersWithReportCount.sort((a, b) => (b.reportCount || 0) - (a.reportCount || 0));
        
        setActiveUsers(usersWithReportCount.slice(0, 3));

      } catch (error) {
        console.error("Error fetching admin dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
      return (
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Dashboard Admin</h1>
            <p className="text-muted-foreground">Selamat datang, {adminUser?.displayName}. Kelola semua aspek dari sini.</p>
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
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Statistik Laporan</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Overview reports={reports} />
                </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Laporan Terbaru</CardTitle>
                    <CardDescription>
                        Total ada {stats.totalReports} laporan di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentReports reports={reports} users={allUsers} />
                </CardContent>
            </Card>
             <Card className="col-span-1 lg:col-span-7">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <CardTitle>Warga Paling Aktif</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    {activeUsers.length > 0 ? activeUsers.map((user, index) => (
                         <div key={user.uid} className="flex items-center gap-4">
                            <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{(user as any).reportCount} Laporan</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-sm col-span-full">Belum ada warga yang membuat laporan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
