"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { reports } from '@/lib/data';

export default function MapPage() {
  const ReportMap = useMemo(() => dynamic(() => import('@/components/map/report-map'), {
    loading: () => <p className="text-center">Peta sedang dimuat...</p>,
    ssr: false
  }), []);

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Peta Masalah Desa</h1>
            <p className="text-muted-foreground">Lihat lokasi laporan masalah dari seluruh warga di peta.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Peta Interaktif</CardTitle>
                <CardDescription>Klik pada penanda untuk melihat detail singkat dari laporan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[60vh] w-full rounded-md overflow-hidden border">
                    <ReportMap reports={reports} />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
