import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, FileText, MapPin, Users, BarChart, Trophy, Construction, Droplets, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { Report, BlogPost } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import RecentReportsPagination from "@/app/components/recent-reports-pagination";
import { Timestamp } from "firebase/firestore";
import MainLayout from "@/components/layout/main-layout";

async function getRecentReports() {
    try {
        const reportsCollection = collection(db, 'reports');
        // Fetch more reports for pagination
        const q = query(reportsCollection, orderBy('createdAt', 'desc'), limit(9));
        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Timestamp to a serializable format (ISO string)
                createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
            } as Report;
        });
        return reportsData;
    } catch (error) {
        console.error("Error fetching recent reports: ", error);
        return [];
    }
}

async function getReportStats() {
    try {
        const reportsCollection = collection(db, 'reports');
        const querySnapshot = await getDocs(reportsCollection);
        const reports = querySnapshot.docs.map(doc => doc.data() as Omit<Report, 'id' | 'createdAt'>);
        
        const categoryCounts = reports.reduce((acc, report) => {
            acc[report.category] = (acc[report.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const categoryRanking = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => ({ category, count }));

        return {
            totalReports: reports.length,
            resolvedReports: reports.filter((r) => r.status === "resolved").length,
            categoryRanking: categoryRanking,
        }
    } catch (error) {
        console.error("Error fetching report stats: ", error);
        return { totalReports: 0, resolvedReports: 0, categoryRanking: [] };
    }
}

async function getLatestBlogPost() {
    try {
        const postsCollection = collection(db, 'blogPosts');
        const q = query(
            postsCollection,
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            publishedAt: (data.publishedAt as Timestamp).toDate().toISOString(),
        } as BlogPost;
    } catch (error) {
        console.error("Error fetching latest blog post: ", error);
        return null;
    }
}


export default async function Home() {
  const recentReports = await getRecentReports();
  const { totalReports, resolvedReports, categoryRanking } = await getReportStats();
  const latestBlogPost = await getLatestBlogPost();
    
    const categoryIcons: { [key: string]: React.ElementType } = {
        'Jalan Rusak': Construction,
        'Drainase Mampet': Droplets,
        'Lampu Jalan': Lightbulb,
    };


  return (
    <MainLayout>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <main className="flex-1">
            <section className="py-20 md:py-20 lg:py-6">
            <div className="mx-4 md:mx-6 lg:mx-8">
                <div className="rounded-2xl shadow-sm bg-[#034032] text-white px-8 py-12 md:px-12 md:py-20 lg:px-16 lg:py-24">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                    <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-4">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-wide font-headline">

                        Suarakan Aspirasi, <br />
                        Bangun Desa Bersama
                        </h1>
                        <p className="max-w-[420px] text-sm leading-relaxed font-normal text-white/80 sm:text-base">
                        Aspirasi Desa adalah jembatan antara warga dan pemerintah desa 
                        untuk melaporkan dan menyelesaikan masalah infrastruktur secara 
                        transparan dan efisien.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto">

                    <Button
    asChild
    size="lg"
    variant="outline"
    className="rounded-lg min-h-11 border-white/50 text-white bg-transparent hover:bg-white/10 hover:text-white w-full sm:w-auto"
    >

                        <Link href="/report/new">
                            <FileText className="mr-2" />
                            Ajukan Laporan
                        </Link>
                        </Button>
                        <Button
                        asChild
                        size="lg"
                        className="rounded-lg min-h-11 bg-white text-[#034032]  hover:bg-white/90"
                        >
                        <Link href="/dashboard/warga/map">
                            <MapPin className="mr-2" />
                            Lihat Peta Masalah
                        </Link>
                        </Button>
                    </div>
                    </div>
                    <div className="flex items-center justify-center">
                    <Image
    src="https://picsum.photos/seed/hero/550/400"
    width={550}
    height={400}
    alt="Hero"
    className="mx-auto aspect-video rounded-xl object-cover w-full max-w-xs sm:max-w-md lg:max-w-full"
    />

                    </div>
                </div>
                </div>
            </div>
            </section>

            <section id="impact" className="py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                            Indikator Dampak
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                            Transparansi & Partisipasi Warga
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Lihat bagaimana partisipasi warga membawa perubahan nyata bagi kemajuan desa kita.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <FileText className="h-10 w-10 mx-auto mb-4 text-primary" />
                                <h3 className="text-4xl font-bold">{totalReports}</h3>
                                <p className="text-muted-foreground mt-1">Total Laporan Diterima</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-600" />
                                <h3 className="text-4xl font-bold">{resolvedReports}</h3>
                                <p className="text-muted-foreground mt-1">Masalah Terselesaikan</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <Users className="h-10 w-10 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-4xl font-bold">125</h3>
                                <p className="text-muted-foreground mt-1">Warga Terdaftar</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>


            <section
            id="how-it-works"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#034032] text-primary-foreground rounded-3xl"
            >
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-primary-foreground/10 px-3 py-1 text-sm">
                    Cara Kerja
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Laporkan Masalah dalam 3 Langkah Mudah
                    </h2>
                    <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Kami membuat proses pelaporan menjadi cepat, mudah, dan
                    transparan untuk semua warga desa.
                    </p>
                </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                <div className="grid gap-2 text-center">
                    <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary-foreground/10 text-primary-foreground rounded-full p-4 ring-8 ring-primary-foreground/5">
                        <FileText className="h-8 w-8" />
                    </div>
                    </div>
                    <h3 className="text-xl font-bold">1. Tulis Laporan</h3>
                    <p className="text-sm text-primary-foreground/80">
                    Isi formulir laporan dengan judul, deskripsi, dan unggah foto
                    kerusakan.
                    </p>
                </div>
                <div className="grid gap-2 text-center">
                    <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary-foreground/10 text-primary-foreground rounded-full p-4 ring-8 ring-primary-foreground/5">
                        <MapPin className="h-8 w-8" />
                    </div>
                    </div>
                    <h3 className="text-xl font-bold">2. Tandai Lokasi</h3>
                    <p className="text-sm text-primary-foreground/80">
                    Pilih lokasi pasti di peta agar tim kami dapat dengan mudah
                    menemukan masalahnya.
                    </p>
                </div>
                <div className="grid gap-2 text-center">
                    <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary-foreground/10 text-primary-foreground rounded-full p-4 ring-8 ring-primary-foreground/5">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    </div>
                    <h3 className="text-xl font-bold">3. Lacak Status</h3>
                    <p className="text-sm text-primary-foreground/80">
                    Pantau perkembangan laporan Anda dari 'pending' hingga
                    'selesai' melalui dashboard.
                    </p>
                </div>
                </div>
            </div>
            </section>
            
            <section id="open-data" className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                            Open Data Desa
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                            Ranking Masalah Infrastruktur
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Data laporan warga yang diolah secara transparan untuk melihat prioritas pembangunan.
                        </p>
                    </div>
                    <Card className="max-w-3xl mx-auto">
                        <CardHeader>
                            <CardTitle>Laporan Terbanyak per Kategori</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categoryRanking.length > 0 ? (
                                categoryRanking.map(({ category, count }, index) => {
                                    const Icon = categoryIcons[category] || FileText;
                                    const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className={cn("h-5 w-5", 
                                                        index === 0 ? "text-amber-400" : 
                                                        index === 1 ? "text-slate-400" :
                                                        index === 2 ? "text-amber-700" : "text-muted-foreground"
                                                    )} />
                                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-medium">{category}</span>
                                                </div>
                                                <span className="font-semibold">{count} Laporan</span>
                                            </div>
                                            <Progress value={percentage} aria-label={`${category} progress`} />
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-muted-foreground text-center col-span-full py-4">Belum ada data laporan untuk ditampilkan.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section id="recent-reports" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Laporan Terbaru dari Warga
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Lihat masalah yang baru-baru ini dilaporkan oleh warga desa.
                </p>
                </div>
                <RecentReportsPagination reports={recentReports} />
            </div>
            </section>
        </main>
        </div>
    </MainLayout>
  );
}
