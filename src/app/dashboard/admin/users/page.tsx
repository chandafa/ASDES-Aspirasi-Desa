
"use client";

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search, UserX, UserCheck, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where, Timestamp } from "firebase/firestore";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("role", "==", "warga"));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => {
                 const data = doc.data();
                 return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                 } as User;
            });
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users: ", error);
            toast({ variant: "destructive", title: "Gagal memuat pengguna", description: "Terjadi kesalahan saat mengambil data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleUserStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, { status: newStatus });
            toast({ title: "Status Pengguna Diperbarui", description: `Pengguna telah ditandai sebagai ${newStatus}.` });
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error updating user status: ", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui Status", description: "Terjadi kesalahan saat mengubah data pengguna." });
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchQuery) {
            return users;
        }
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

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
                        Menampilkan {filteredUsers.length} dari total {users.length} pengguna "warga".
                    </CardDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama atau email..."
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
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tanggal Registrasi</TableHead>
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
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.uid} className={user.status === 'inactive' ? 'opacity-50' : ''}>
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
                                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                {user.status || 'active'}
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
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem 
                                                                className={user.status === 'inactive' ? "text-green-600 focus:text-green-600 focus:bg-green-50" : "text-red-600 focus:text-red-600 focus:bg-red-50"} 
                                                                onSelect={(e) => e.preventDefault()}
                                                            >
                                                                {user.status === 'inactive' ? <UserCheck className="mr-2 h-4 w-4"/> : <UserX className="mr-2 h-4 w-4"/>}
                                                                {user.status === 'inactive' ? 'Aktifkan Akun' : 'Nonaktifkan Akun'}
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                 <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini akan mengubah status akun pengguna. Pengguna yang nonaktif tidak dapat login atau mengakses fitur.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleToggleUserStatus(user.id!, user.status || 'active')} className={user.status === 'inactive' ? '' : 'bg-destructive hover:bg-destructive/90'}>
                                                            {user.status === 'inactive' ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        {searchQuery ? "Pengguna tidak ditemukan." : "Belum ada pengguna warga."}
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
