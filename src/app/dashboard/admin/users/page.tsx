import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/lib/data";
import { MoreHorizontal } from "lucide-react";

export default function ManageUsersPage() {
  const wargaUsers = users.filter(u => u.role === 'warga');

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Manajemen Akun Pengguna</h1>
            <p className="text-muted-foreground">Kelola semua akun pengguna yang terdaftar di sistem.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Daftar Pengguna</CardTitle>
                <CardDescription>
                    Menampilkan {wargaUsers.length} pengguna dengan peran "warga".
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tanggal Registrasi</TableHead>
                            <TableHead>
                                <span className="sr-only">Aksi</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wargaUsers.map((user) => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                                            <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                                            <DropdownMenuItem>Nonaktifkan Akun</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
