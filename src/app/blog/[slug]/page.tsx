import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import type { BlogPost } from "@/lib/types";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

async function getBlogPost(slug: string) {
    try {
        const postsCollection = collection(db, 'blogPosts');
        const q = query(postsCollection, where('slug', '==', slug), where('status', '==', 'published'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            publishedAt: (data.publishedAt as Timestamp).toDate().toISOString(),
        } as BlogPost;
    } catch (error) {
        console.error("Error fetching blog post by slug: ", error);
        return null;
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
        <MainLayout>
            <div className="container py-8">
                <div className="max-w-3xl mx-auto text-center">
                    <Card>
                        <CardHeader>
                            <CardTitle>Artikel Tidak Ditemukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Maaf, kami tidak dapat menemukan artikel yang Anda cari.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
        <div className="container py-8">
            <article className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">{post.title}</h1>
                    <div className="flex items-center justify-center gap-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Admin Desa</span>
                        </div>
                    </div>
                </div>

                <img 
                    src={post.coverImage}
                    alt={post.title}
                    width={1200}
                    height={630}
                    className="rounded-xl aspect-video object-cover"
                    // priority
                />
            
                <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {post.body}
                </div>

                {/* TODO: Implement comments section */}
            </article>
        </div>
    </MainLayout>
  );
}
