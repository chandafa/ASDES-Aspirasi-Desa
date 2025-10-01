
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Report, ReportComment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, AlertTriangle, MapPin, Tag, ShieldAlert, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import ReportComments from "./report-comments";
import MainLayout from "@/components/layout/main-layout";

export default function ReportDetailClient({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ReportMap = useMemo(() => dynamic(() => import('@/components/map/report-map'), {
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Peta sedang dimuat...</p></div>,
    ssr: false
  }), []);


  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const reportDocRef = doc(db, "reports", reportId);
        const reportDocSnap = await getDoc(reportDocRef);

        if (reportDocSnap.exists()) {
          const data = reportDocSnap.data();
          setReport({
            id: reportDocSnap.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            comments: data.comments || [],
          } as Report);
        } else {
          setError("Laporan tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Gagal memuat data laporan.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleCommentAdded = useCallback((newComment: ReportComment) => {
    setReport((prevReport) => {
      if (!prevReport) return null;
      return {
        ...prevReport,
        comments: [...(prevReport.comments || []), newComment],
      };
    });
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-xl">Terjadi Kesalahan</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/dashboard/warga/reports">Kembali ke Daftar Laporan</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </MainLayout>
    );
  }

  if (!report) return null;

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                      <Badge variant={getStatusVariant(report.status)} className={cn("mb-2 capitalize", getStatusClass(report.status))}>
                          {report.status.replace('_', ' ')}
                      </Badge>
                      <CardTitle className="text-3xl font-bold font-headline">{report.title}</CardTitle>
                      <CardDescription>Laporan ID: {report.id}</CardDescription>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-2">
                      <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{report.category}</span>
                      </div>
                      <div className="flex items-center gap-2 capitalize">
                          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                          <span>Prioritas {report.priority}</span>
                      </div>
                  </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                  <Card>
                      <CardHeader>
                          <CardTitle>Foto Laporan</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Carousel className="w-full">
                              <CarouselContent>
                                  {report.photos.map((photo, index) => (
                                  <CarouselItem key={index}>
                                      <img 
                                      data-ai-hint="damaged infrastructure"
                                      src={photo}
                                      alt={`Foto Laporan ${index + 1}`}
                                      width={800}
                                      height={600}
                                      className="rounded-lg object-cover aspect-[4/3]"
                                      />
                                  </CarouselItem>
                                  ))}
                              </CarouselContent>
                              <CarouselPrevious className="left-2" />
                              <CarouselNext className="right-2" />
                          </Carousel>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Lokasi Masalah
                          </CardTitle>
                          <Button asChild variant="outline" size="sm">
                              <Link href={`https://www.google.com/maps/search/?api=1&query=${report.location.lat},${report.location.lng}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Buka di Google Maps
                              </Link>
                          </Button>
                      </CardHeader>
                      <CardContent>
                          <div className="h-80 w-full rounded-lg overflow-hidden border">
                              <ReportMap reports={[report]} />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{report.location.address}</p>
                      </CardContent>
                  </Card>
              </div>
              <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Deskripsi Lengkap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                    </CardContent>
                </Card>
                <ReportComments report={report} onCommentAdded={handleCommentAdded} />
              </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

    
