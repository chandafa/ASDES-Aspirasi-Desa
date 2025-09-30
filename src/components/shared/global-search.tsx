"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import type { Report } from "@/lib/types";
import { Loader2, Search, FileText } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";

export function GlobalSearch() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Fetch reports only when the dialog is opened for the first time
        if (open && reports.length === 0) {
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
                    console.error("Error fetching reports for search: ", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchReports();
        }
    }, [open, reports.length]);

    const filteredReports = useMemo(() => {
        if (!searchQuery) {
            return [];
        }
        return reports.filter(report =>
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.id.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10); // Limit results to 10
    }, [reports, searchQuery]);

    const handleLinkClick = () => {
        setOpen(false);
        setSearchQuery("");
    }
    
    // Reset search query when dialog is closed
    useEffect(() => {
        if (!open) {
            setSearchQuery("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Cari Laporan</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0">
                <DialogHeader className="p-4 pb-2 border-b">
                     <DialogTitle>Cari Laporan di Seluruh Situs</DialogTitle>
                     <DialogDescription className="sr-only">Ketik di bawah untuk mencari laporan berdasarkan judul atau ID.</DialogDescription>
                     <div className="relative pt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Ketik judul atau ID laporan..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </DialogHeader>
                <div className="p-4 pt-0">
                    {loading && searchQuery ? (
                        <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Memuat laporan...</span>
                        </div>
                    ) : searchQuery && filteredReports.length > 0 ? (
                        <ScrollArea className="h-[250px]">
                            <div className="space-y-1">
                                {filteredReports.map(report => (
                                    <Link
                                        key={report.id}
                                        href={`/report/${report.id}`}
                                        onClick={handleLinkClick}
                                        className="block p-2 rounded-md hover:bg-accent"
                                    >
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium truncate">{report.title}</p>
                                                <p className="text-xs text-muted-foreground">ID: {report.id}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : searchQuery ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Laporan tidak ditemukan.
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Mulai ketik untuk mencari laporan.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
