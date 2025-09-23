"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/components/providers/auth-provider';
import type { BlogPost } from '@/lib/types';

const blogFormSchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter.').max(150, 'Judul maksimal 150 karakter.'),
  body: z.string().min(50, 'Isi artikel minimal 50 karakter.'),
  status: z.enum(['draft', 'published'], { required_error: 'Pilih status artikel.' }),
  coverImage: z.string().url('URL gambar tidak valid.').min(1, 'URL gambar tidak boleh kosong.'),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
    initialData?: BlogPost | null;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      body: initialData?.body || '',
      status: initialData?.status || 'draft',
      coverImage: initialData?.coverImage || 'https://picsum.photos/seed/placeholder/800/400',
    },
  });

  const slugify = (text: string) =>
    text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');

  async function onSubmit(data: BlogFormValues) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Akses Ditolak', description: 'Anda harus login untuk melakukan tindakan ini.' });
        return;
    }

    const postData = {
        ...data,
        slug: slugify(data.title),
        authorUid: user.uid,
        updatedAt: serverTimestamp(),
    };

    try {
        if (initialData) {
            // Update existing document
            const postRef = doc(db, 'blogPosts', initialData.id);
            await updateDoc(postRef, postData);
            toast({ title: 'Artikel Diperbarui', description: 'Perubahan pada artikel telah disimpan.' });
        } else {
            // Create new document
            await addDoc(collection(db, 'blogPosts'), {
                ...postData,
                publishedAt: serverTimestamp(),
            });
            toast({ title: 'Artikel Diterbitkan!', description: 'Artikel baru telah berhasil dibuat.' });
        }
        router.push('/dashboard/admin/blog');
        router.refresh(); // To see the changes
    } catch (error) {
        console.error("Error saving post: ", error);
        toast({
            variant: 'destructive',
            title: 'Gagal Menyimpan',
            description: 'Terjadi kesalahan saat menyimpan artikel. Silakan coba lagi.',
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Konten Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Pembangunan Jembatan Desa Selesai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Artikel</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis isi artikel di sini..."
                      className="resize-y"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar Sampul</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>Gunakan URL dari layanan hosting gambar seperti Unsplash atau Picsum Photos.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status publikasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      'Draft' akan disimpan tapi tidak terlihat oleh warga. 'Published' akan langsung tampil di halaman blog.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {initialData ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
