import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, FileText, MapPin, MessageSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { recentReports, reports, blogPosts } from '@/lib/data';
import { Logo } from '@/components/shared/logo';

export default function Home() {
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const totalArticles = blogPosts.length;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Suarakan Aspirasi, Bangun Desa Bersama
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Aspirasi Desa adalah jembatan antara warga dan pemerintah desa untuk melaporkan dan menyelesaikan masalah infrastruktur secara transparan dan efisien.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="min-h-11">
                    <Link href="/report/new">
                      <FileText className="mr-2" />
                      Ajukan Laporan
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="min-h-11">
                    <Link href="/dashboard/admin">
                      <MapPin className="mr-2" />
                      Lihat Peta Masalah
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                data-ai-hint="village illustration"
                src="https://picsum.photos/600/400"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="stats" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-teal-50 dark:bg-teal-900/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-teal-500 rounded-full p-4 mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold">{totalReports}</h3>
                  <p className="text-muted-foreground">Total Laporan</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 dark:bg-green-900/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-green-500 rounded-full p-4 mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold">{resolvedReports}</h3>
                  <p className="text-muted-foreground">Masalah Teratasi</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-900/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-amber-500 rounded-full p-4 mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold">{totalArticles}</h3>
                  <p className="text-muted-foreground">Artikel Berita</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Cara Kerja</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Laporkan Masalah dalam 3 Langkah Mudah</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Kami membuat proses pelaporan menjadi cepat, mudah, dan transparan untuk semua warga desa.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <FileText className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">1. Tulis Laporan</h3>
                <p className="text-sm text-muted-foreground">
                  Isi formulir laporan dengan judul, deskripsi, dan unggah foto kerusakan.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">2. Tandai Lokasi</h3>
                <p className="text-sm text-muted-foreground">
                  Pilih lokasi pasti di peta agar tim kami dapat dengan mudah menemukan masalahnya.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">3. Lacak Status</h3>
                <p className="text-sm text-muted-foreground">
                  Pantau perkembangan laporan Anda dari 'pending' hingga 'selesai' melalui dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="recent-reports" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Laporan Terbaru dari Warga</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Lihat masalah yang baru-baru ini dilaporkan oleh warga desa.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {recentReports.slice(0, 3).map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'in_progress' ? 'secondary' : 'destructive'}
                        className={report.status === 'resolved' ? 'bg-green-500/20 text-green-700' : report.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-red-500/20 text-red-700'}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Image
                      data-ai-hint="damaged road"
                      src={report.photos[0]}
                      width="400"
                      height="250"
                      alt={report.title}
                      className="rounded-md object-cover aspect-video mb-4"
                    />
                    <p className="text-sm text-muted-foreground line-clamp-3">{report.description}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                        <span>{report.category}</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Dibangun untuk memajukan desa.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Aspirasi Desa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
