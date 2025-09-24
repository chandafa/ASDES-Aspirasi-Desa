
"use client";

import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import type { Report } from '@/lib/types';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';

export default function GlobalMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const reportsCollection = collection(db, 'reports');
        const querySnapshot = await getDocs(reportsCollection);
        const reportsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            } as Report;
        });
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports for map: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const ReportMap = useMemo(() => dynamic(() => import('@/components/map/report-map'), {
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Peta sedang dimuat...</p></div>,
    ssr: false
  }), []);

  return (
    <MainLayout>
        <div className="container py-8">
            <div className="space-y-2 mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Peta Masalah Global</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                Visualisasi semua laporan masalah yang dikirimkan oleh warga di seluruh wilayah desa.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Peta Interaktif Laporan</CardTitle>
                    <CardDescription>Klik pada setiap penanda untuk melihat detail singkat dari laporan yang masuk.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[70vh] w-full rounded-md overflow-hidden border">
                        {loading ? (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                        ) : (
                        <ReportMap reports={reports} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </MainLayout>
  );
}
