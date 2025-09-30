"use client";

import { useEffect, useState, useMemo } from "react";
import emailjs from 'emailjs-com';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Loader2, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import type { Report, ReportStatus, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ManageReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchReports = async () => {
        setLoading(true);
        try {
            const reportsCollection = collection(db, 'reports');
            const q = query(reportsCollection, orderBy('createdAt', 'desc'));
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
            console.error("Error fetching reports: ", error);
            toast({ variant: "destructive", title: "Gagal memuat laporan", description: "Terjadi kesalahan saat mengambil data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);
    
    const handleDeleteReport = async (reportId: string) => {
        try {
            await deleteDoc(doc(db, "reports", reportId));
            toast({ title: "Laporan Dihapus", description: "Laporan telah berhasil dihapus dari sistem." });
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (error) {
            console.error("Error deleting report: ", error);
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus laporan." });
        }
    };

    const sendNotificationEmail = async (report: Report) => {
        try {
            const userDocRef = doc(db, "users", report.createdBy);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                console.error(`User data not found for UID: ${report.createdBy}`);
                toast({
                    variant: 'destructive',
                    title: 'Gagal Mengirim Email',
                    description: `Data pengguna untuk laporan ini tidak ditemukan.`,
                });
                return;
            }
            const userData = userDocSnap.data() as User;

            const templateParams = {
                to_name: userData.name,
                to_email: userData.email,
                report_title: report.title,
                report_id: report.id,
                report_status: "Selesai (Resolved)",
                base_url: "https://aspirasi-desa.netlify.app" // 🔥 ganti dengan URL websitemu
            };

            emailjs.send(
                "service_taaotx6x",
                "template_3mwr3s1",
                templateParams,
                "xiMC-WR1ha1nn8atz" // langsung hardcode dulu untuk tes
            )
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                toast({
                    title: 'Notifikasi Terkirim',
                    description: `Email telah dikirim ke ${userData.email}.`,
                });
            }, (error) => {
                console.error('FAILED...', error);
                toast({
                   variant: 'destructive',
                   title: 'Gagal Mengirim Email Notifikasi',
                   description: `Terjadi kesalahan saat mengirim notifikasi. Detail: ${error.text || 'Periksa konfigurasi EmailJS Anda.'}`,
               });
            });

        } catch (error: any) {
             console.error('Failed to send email:', error);
            if (error.code === 'permission-denied') {
                toast({
                    variant: 'destructive',
                    title: 'Akses Ditolak',
                    description: 'Gagal mengirim email. Periksa Aturan Keamanan (Security Rules) Firestore Anda. Admin mungkin tidak memiliki izin untuk membaca data pengguna.',
                    duration: 9000,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Gagal Mengirim Email Notifikasi',
                    description: 'Terjadi kesalahan saat mengirim notifikasi.',
                });
            }
        }
    };
    
    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
        const reportRef = doc(db, "reports", reportId);
        try {
            await updateDoc(reportRef, { status: status });
            toast({ title: "Status Diperbarui", description: `Laporan telah ditandai sebagai ${status}.` });
            
            const updatedReport = reports.find(r => r.id === reportId);
            if (updatedReport && status === 'resolved') {
                await sendNotificationEmail({ ...updatedReport, status: status });
            }

            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: status } : r));
        } catch (error) {
            console.error("Error updating status: ", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Terjadi kesalahan saat mengubah status laporan." });
        }
    };

    const filteredReports = useMemo(() => {
        if (!searchQuery) {
            return reports;
        }
        return reports.filter(report =>
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [reports, searchQuery]);

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
    
    const statusOptions: ReportStatus[] = ["pending", "in_progress", "resolved", "rejected"];

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
                    Total {reports.length} laporan masuk dari warga. Menampilkan {filteredReports.length} laporan.
                </CardDescription>
                 <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan judul atau ID laporan..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Laporan</TableHead>
                            <TableHead>Prioritas</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell className={cn("capitalize", getPriorityClass(report.priority))}>{report.priority}</TableCell>
                                    <TableCell>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(report.status)} className={cn("capitalize", getStatusClass(report.status))}>
                                            {report.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
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
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>Ubah Status</DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            {statusOptions.map(status => (
                                                                <DropdownMenuItem key={status} onSelect={() => handleUpdateStatus(report.id, status)} disabled={report.status === status}>
                                                                    <span className="capitalize">{status.replace('_', ' ')}</span>
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={e => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4"/> Hapus
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus laporan secara permanen dari server.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteReport(report.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    {searchQuery ? "Laporan tidak ditemukan." : "Belum ada laporan."}
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
