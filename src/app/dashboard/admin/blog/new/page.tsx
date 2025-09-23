import { BlogForm } from "../components/blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Tulis Artikel Baru</h1>
            <p className="text-muted-foreground">Bagikan informasi penting atau berita terbaru kepada warga.</p>
        </div>
        <BlogForm />
    </div>
  );
}
