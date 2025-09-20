"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/lib/data"; // Keep for user lookup for now
import { MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ManageReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const reportsCollection = collection(db, 'reports');
                const q = query(reportsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const reportsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Report));
                setReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
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
            case 'resolved': return 'bg-green-500/20 text-green-700';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-700';
            case 'pending': return 'bg-blue-500/20 text-blue-700';
            case 'rejected': return 'bg-red-500/20 text-red-700';
            default: return '';
        }
    }

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'tinggi': return 'text-red-600 font-medium';
            case 'sedang': return 'text-yellow-600 font-medium';
            case 'rendah': return 'text-gray-600';
            default: return '';
        }
    }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Manajemen Laporan</h1>
            <p className="text-muted-foreground">Lihat, kelola, dan perbarui status semua laporan dari warga.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Daftar Laporan</CardTitle>
                <CardDescription>
                    Total {reports.length} laporan masuk dari warga.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Laporan</TableHead>
                            <TableHead>Pelapor</TableHead>
                            <TableHead>Prioritas</TableHead>
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
                                <TableCell colSpan={6} className="text-center h-24">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : reports.length > 0 ? (
                            reports.map((report) => {
                                const user = users.find(u => u.uid === report.createdBy); // Mock user lookup
                                return (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">{report.title}</TableCell>
                                        <TableCell>{user?.name || 'Anonim'}</TableCell>
                                        <TableCell className={cn("capitalize", getPriorityClass(report.priority))}>{report.priority}</TableCell>
                                        <TableCell>{report.createdAt ? report.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(report.status)} className={getStatusClass(report.status)}>
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild><Link href={`/report/${report.id}`}>Lihat Detail</Link></DropdownMenuItem>
                                                    <DropdownMenuItem>Ubah Status</DropdownMenuItem>
                                                    <DropdownMenuItem>Hapus</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                             <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    Belum ada laporan.
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
