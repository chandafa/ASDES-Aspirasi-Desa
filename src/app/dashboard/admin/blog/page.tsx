import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { blogPosts, users } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ManageBlogPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Manajemen Blog</h1>
                <p className="text-muted-foreground">Buat, edit, dan publikasikan artikel untuk warga.</p>
            </div>
            <Button asChild>
                <Link href="#">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tulis Artikel Baru
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Daftar Artikel</CardTitle>
                <CardDescription>
                    Terdapat {blogPosts.length} artikel di dalam sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Artikel</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Tanggal Publikasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                                <span className="sr-only">Aksi</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogPosts.map((post) => {
                            const author = users.find(u => u.uid === post.authorUid);
                            return (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{author?.name || 'Admin'}</TableCell>
                                    <TableCell>{new Date(post.publishedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? 'bg-green-500/20 text-green-700' : ''}>
                                            {post.status}
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
                                                <DropdownMenuItem asChild><Link href={`/blog/${post.slug}`}>Lihat</Link></DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Hapus</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
