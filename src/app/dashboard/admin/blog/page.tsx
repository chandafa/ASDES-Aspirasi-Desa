"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, Timestamp } from "firebase/firestore";
import type { BlogPost } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ManageBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const postsCollection = collection(db, 'blogPosts');
            const q = query(postsCollection, orderBy('publishedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate().toISOString() : data.publishedAt,
                } as BlogPost;
            });
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching blog posts: ", error);
            toast({ variant: "destructive", title: "Gagal memuat artikel", description: "Terjadi kesalahan saat mengambil data dari server." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: string) => {
        try {
            await deleteDoc(doc(db, "blogPosts", postId));
            toast({ title: "Artikel Dihapus", description: "Artikel blog telah berhasil dihapus." });
            fetchPosts(); // Refresh list
        } catch (error) {
            console.error("Error deleting post: ", error);
            toast({ variant: "destructive", title: "Gagal menghapus artikel", description: "Terjadi kesalahan saat menghapus data." });
        }
    };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Manajemen Blog</h1>
                <p className="text-muted-foreground">Buat, edit, dan publikasikan artikel untuk warga.</p>
            </div>
            <Button asChild>
                <Link href="/dashboard/admin/blog/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tulis Artikel Baru
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Daftar Artikel</CardTitle>
                <CardDescription>
                    Terdapat {posts.length} artikel di dalam sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Artikel</TableHead>
                            <TableHead>Tanggal Publikasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                                <span className="sr-only">Aksi</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{new Date(post.publishedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? 'bg-green-500/20 text-green-700' : ''}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
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
                                                    <DropdownMenuItem asChild><Link href={`/blog/${post.slug}`} className="flex items-center"><Link href={`/blog/${post.slug}`}>Lihat</Link></Link></DropdownMenuItem>
                                                    <DropdownMenuItem asChild><Link href={`/dashboard/admin/blog/edit/${post.id}`} className="flex items-center"><Edit className="mr-2 h-4 w-4"/>Edit</Link></DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4"/>Hapus
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus artikel secara permanen dari server.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    Belum ada artikel yang dibuat.
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
