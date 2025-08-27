import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="container py-8">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Blog Aspirasi Desa</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Informasi terbaru, berita pembangunan, dan pengumuman penting dari pemerintah desa.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <Image
                data-ai-hint="village activity"
                src={post.coverImage}
                width={800}
                height={400}
                alt={post.title}
                className="aspect-video object-cover"
              />
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
