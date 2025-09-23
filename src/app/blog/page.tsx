import BlogPostsPagination from "@/app/components/blog-posts-pagination";
import { blogPosts } from "@/lib/data";

export default function BlogPage() {
  return (
    <div className="container py-8">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Blog Aspirasi Desa</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Informasi terbaru, berita pembangunan, dan pengumuman penting dari pemerintah desa.
        </p>
      </div>
      <BlogPostsPagination posts={blogPosts} />
    </div>
  );
}
