import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container py-8">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Detail Blog Post: {params.slug}</CardTitle>
                    <CardDescription>
                        Halaman ini akan menampilkan isi dari sebuah blog post,
                        lengkap dengan gambar, teks, dan kolom komentar untuk warga.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Konten blog post akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
