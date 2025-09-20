"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import type { Report } from "@/lib/types";

export default function WargaReportsPage() {
    const { user } = useAuth();
    const [userReports, setUserReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) {
                setLoading(false);
                return;
            };

            setLoading(true);
            try {
                const reportsCollection = collection(db, 'reports');
                const q = query(
                    reportsCollection, 
                    where("createdBy", "==", user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const reportsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Report));
                setUserReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user]);

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
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Laporan Saya</h1>
                <p className="text-muted-foreground">Lacak semua laporan yang pernah Anda ajukan.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Laporan</CardTitle>
                    <CardDescription>
                        Anda telah membuat total {userReports.length} laporan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Laporan</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                    <span className="sr-only">Aksi</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : userReports.length > 0 ? (
                                userReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">{report.title}</TableCell>
                                        <TableCell>{report.category}</TableCell>
                                        <TableCell>{report.createdAt ? report.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(report.status)} className={cn(getStatusClass(report.status))}>
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/report/${report.id}`}>
                                                    Lihat Detail
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        Anda belum membuat laporan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
