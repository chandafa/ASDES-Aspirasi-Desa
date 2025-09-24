"use client";

import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import type { Report } from '@/lib/types';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

export default function WargaMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const reportsCollection = collection(db, 'reports');
        const q = query(reportsCollection, where("createdBy", "==", user.uid));
        const querySnapshot = await getDocs(q);
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
        console.error("Error fetching user reports for map: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const ReportMap = useMemo(() => dynamic(() => import('@/components/map/report-map'), {
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Peta sedang dimuat...</p></div>,
    ssr: false
  }), []);

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Peta Laporan Saya</h1>
            <p className="text-muted-foreground">Lihat lokasi semua laporan masalah yang telah Anda buat.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Peta Interaktif</CardTitle>
                <CardDescription>
                    {reports.length > 0 
                        ? 'Klik pada penanda untuk melihat detail singkat dari laporan Anda.'
                        : 'Anda belum membuat laporan apa pun.'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[60vh] w-full rounded-md overflow-hidden border">
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
  );
}
