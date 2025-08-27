import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Detail Laporan: #{params.id}</CardTitle>
                    <CardDescription>
                        Halaman ini akan menampilkan detail lengkap dari laporan, termasuk foto,
                        lokasi di peta, dan timeline status pengerjaan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Konten detail laporan akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
