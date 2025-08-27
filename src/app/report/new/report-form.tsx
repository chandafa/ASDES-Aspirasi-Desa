'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizeReport } from '@/ai/flows/summarize-report';
import { Loader2, MapPin, Sparkles, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

const reportFormSchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter.').max(100, 'Judul maksimal 100 karakter.'),
  category: z.string({ required_error: 'Pilih kategori laporan.' }),
  priority: z.string({ required_error: 'Pilih tingkat prioritas.' }),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export function ReportForm() {
  const { toast } = useToast();
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  async function onSubmit(data: ReportFormValues) {
    toast({
      title: 'Laporan Terkirim!',
      description: 'Terima kasih, laporan Anda telah kami terima dan akan segera diproses.',
    });
    console.log(data);
  }

  const handleSummarize = async () => {
    const { title, description } = form.getValues();
    if (!title || !description) {
        toast({
            variant: "destructive",
            title: "Data Kurang",
            description: "Harap isi judul dan deskripsi sebelum membuat ringkasan.",
        });
      return;
    }
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await summarizeReport({ reportTitle: title, reportDescription: description });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to summarize:', error);
      setSummary('Gagal membuat ringkasan. Silakan coba lagi.');
       toast({
            variant: "destructive",
            title: "Error",
            description: "Gagal membuat ringkasan AI.",
        });
    } finally {
      setIsSummarizing(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Detail Laporan</CardTitle>
            <CardDescription>Jelaskan masalah yang Anda temukan secara rinci.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Laporan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Jalan berlubang di depan sekolah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori masalah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jalan-rusak">Jalan Rusak</SelectItem>
                        <SelectItem value="jembatan-patah">Jembatan Patah</SelectItem>
                        <SelectItem value="drainase-mampet">Drainase Mampet</SelectItem>
                        <SelectItem value="lampu-jalan">Lampu Jalan</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat Prioritas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih prioritas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rendah">Rendah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="tinggi">Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan detail kerusakan, lokasi, dan dampaknya bagi warga..."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Gunakan fitur AI di bawah untuk membuat ringkasan otomatis dari laporan Anda.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="button" variant="outline" onClick={handleSummarize} disabled={isSummarizing} className="w-full">
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Buat Ringkasan dengan AI
            </Button>

            {summary && (
                <Card className="bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{summary}</p>
                    </CardContent>
                </Card>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Lokasi & Foto</CardTitle>
                <CardDescription>Bantu kami menemukan lokasi masalah lebih cepat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label>Lokasi di Peta</Label>
                    <div className="h-64 w-full rounded-md bg-secondary flex items-center justify-center">
                        <div className='text-center text-muted-foreground'>
                            <MapPin className="mx-auto h-12 w-12 mb-2" />
                            <p>Placeholder Peta</p>
                            <Button variant="link">Pilih Lokasi</Button>
                        </div>
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label>Foto Pendukung</Label>
                    <div className="h-32 w-full rounded-md border-2 border-dashed border-border flex items-center justify-center">
                        <div className='text-center text-muted-foreground'>
                            <Upload className="mx-auto h-8 w-8 mb-2" />
                            <p>Seret & lepas file atau</p>
                             <Button variant="link">Pilih File</Button>
                        </div>
                    </div>
                 </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">Batal</Button>
            <Button type="submit">Kirim Laporan</Button>
        </div>
      </form>
    </Form>
  );
}
