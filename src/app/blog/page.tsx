import BlogPostsPagination from "@/app/components/blog-posts-pagination";
import MainLayout from "@/components/layout/main-layout";
import { db } from "@/lib/firebase";
import type { BlogPost } from "@/lib/types";
import { collection, getDocs, orderBy, query, where, Timestamp } from "firebase/firestore";

async function getBlogPosts() {
    try {
        const postsCollection = collection(db, 'blogPosts');
        const q = query(
            postsCollection,
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                publishedAt: (data.publishedAt as Timestamp).toDate().toISOString(),
            } as BlogPost;
        });
        return postsData;
    } catch (error) {
        console.error("Error fetching blog posts: ", error);
        return [];
    }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <MainLayout>
        <div className="container py-8">
            <div className="space-y-2 mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Blog Aspirasi Desa</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                Informasi terbaru, berita pembangunan, dan pengumuman penting dari pemerintah desa.
                </p>
            </div>
            <BlogPostsPagination posts={posts} />
        </div>
    </MainLayout>
  );
}
