"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/lib/types';
import { BlogForm } from '../../components/blog-form';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'blogPosts', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          setError('Artikel tidak ditemukan.');
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError('Gagal memuat artikel.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
     return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
        </Card>
     )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline">Edit Artikel</h1>
        <p className="text-muted-foreground">Perbarui konten artikel dan informasinya.</p>
      </div>
      <BlogForm initialData={post} />
    </div>
  );
}
