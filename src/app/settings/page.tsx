import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container py-8">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan</CardTitle>
                    <CardDescription>
                        Halaman ini untuk mengatur profil pengguna dan preferensi aplikasi,
                        seperti mengubah nama, foto profil, dan tema (light/dark mode).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Konten pengaturan akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
