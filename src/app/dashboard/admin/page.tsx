import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";

export default function AdminDashboard() {
  const user = users[0]; // Admin Desa

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Dashboard Admin</h1>
            <p className="text-muted-foreground">Selamat datang, {user.name}.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                    Halaman ini untuk dashboard admin. Di sini akan ada statistik lanjutan,
                    peta masalah interaktif, dan tabel untuk mengelola semua laporan warga.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Konten admin akan ditampilkan di sini.</p>
            </CardContent>
        </Card>
    </div>
  )
}
