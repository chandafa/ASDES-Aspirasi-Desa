'use client';

import { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
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
import { Loader2, MapPin, Sparkles, Upload, X } from 'lucide-react';
import type { ReportPriority } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const reportFormSchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter.').max(100, 'Judul maksimal 100 karakter.'),
  category: z.string({ required_error: 'Pilih kategori laporan.' }),
  priority: z.string({ required_error: 'Pilih tingkat prioritas.' }) as z.ZodType<ReportPriority>,
  description: z.string().min(20, 'Deskripsi minimal 20 karakter.'),
  photos: z.array(z.string().url()).min(1, 'Unggah minimal satu foto.'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

type LocationState = {
    lat: number;
    lng: number;
    address: string;
} | null;

export function ReportForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: '',
      description: '',
      photos: [],
      priority: 'sedang',
    },
  });

  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [location, setLocation] = useState<LocationState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageToHosting = useCallback(async (file: File): Promise<string | null> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = 'https://beruangrasa.academychan.my.id/upload.php';

      try {
          const response = await fetch(uploadUrl, {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const result = await response.json();

          if (result.url) {
            toast({ title: 'Gambar Berhasil Diunggah', description: 'Gambar Anda telah diunggah ke laporan.' });
            return result.url;
          } else {
            throw new Error(result.error || 'URL tidak ditemukan di respons server.');
          }
          
      } catch (error: any) {
          console.error('Error uploading image:', error);
          toast({ title: 'Gagal Mengunggah Gambar', description: error.message || 'Tidak dapat terhubung ke server upload.', variant: 'destructive' });
          return null;
      }
  }, [toast]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls = [];
    for (const file of Array.from(files)) {
      const url = await uploadImageToHosting(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }
    const currentPhotos = form.getValues('photos');
    form.setValue('photos', [...currentPhotos, ...uploadedUrls]);
    setIsUploading(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };
  
  const handleRemovePhoto = (index: number) => {
    const currentPhotos = form.getValues('photos');
    const newPhotos = [...currentPhotos];
    newPhotos.splice(index, 1);
    form.setValue('photos', newPhotos);
  };

  const handleLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const address = data.display_name || `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
                    
                    const newLocation = {
                        lat: latitude,
                        lng: longitude,
                        address: address
                    };
                    
                    setLocation(newLocation);
                    form.setValue('location', newLocation, { shouldValidate: true });
                    toast({ title: 'Lokasi Ditemukan', description: 'Alamat berhasil diidentifikasi.' });

                } catch (error) {
                     toast({ variant: 'destructive', title: 'Gagal Mendapatkan Alamat', description: 'Tidak dapat mengambil data alamat dari koordinat.' });
                     const fallbackLocation = {
                        lat: latitude,
                        lng: longitude,
                        address: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
                     };
                     setLocation(fallbackLocation);
                     form.setValue('location', fallbackLocation, { shouldValidate: true });
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                toast({ variant: 'destructive', title: 'Gagal Mendapatkan Lokasi', description: error.message });
                setIsFetchingLocation(false);
            }
        );
    } else {
        toast({ variant: 'destructive', title: 'Geolocation Tidak Didukung', description: 'Browser Anda tidak mendukung geolokasi.' });
        setIsFetchingLocation(false);
    }
  };

  async function onSubmit(data: ReportFormValues) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Anda harus login', description: 'Silakan login untuk mengirim laporan.' });
        return;
    }

    try {
        await addDoc(collection(db, 'reports'), {
            ...data,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            status: 'pending',
            timeline: [
                {
                    actorUid: user.uid,
                    action: 'Laporan dibuat',
                    message: '',
                    timestamp: new Date().toISOString(),
                }
            ]
        });

        toast({
            title: 'Laporan Terkirim!',
            description: 'Terima kasih, laporan Anda telah kami terima dan akan segera diproses.',
        });
        
        router.push('/dashboard/warga/reports');

    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            variant: 'destructive',
            title: 'Gagal Menyimpan Laporan',
            description: 'Terjadi kesalahan saat menyimpan laporan Anda. Silakan coba lagi.',
        });
    }
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

  const photos = form.watch('photos');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-[#034032] text-primary-foreground border-none">
          <CardHeader>
            <CardTitle>Detail Laporan</CardTitle>
            <CardDescription className="text-primary-foreground/80">Jelaskan masalah yang Anda temukan secara rinci.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Laporan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Jalan berlubang di depan sekolah" {...field} className="bg-white text-card-foreground" />
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
                        <SelectTrigger className="bg-white text-card-foreground">
                          <SelectValue placeholder="Pilih kategori masalah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Jalan Rusak">Jalan Rusak</SelectItem>
                        <SelectItem value="Jembatan Patah">Jembatan Patah</SelectItem>
                        <SelectItem value="Drainase Mampet">Drainase Mampet</SelectItem>
                        <SelectItem value="Lampu Jalan">Lampu Jalan</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
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
                        <SelectTrigger className="bg-white text-card-foreground">
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
                      className="resize-none bg-white text-card-foreground"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                   <FormDescription className="text-primary-foreground/80">
                    Gunakan fitur AI di bawah untuk membuat ringkasan otomatis dari laporan Anda.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="button" variant="outline" onClick={handleSummarize} disabled={isSummarizing} className="w-full bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 text-primary-foreground">
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Buat Ringkasan dengan AI
            </Button>

            {summary && (
                <Card className="bg-white/5">
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-primary-foreground/80">{summary}</p>
                    </CardContent>
                </Card>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#034032] text-primary-foreground border-none">
            <CardHeader>
                <CardTitle>Lokasi & Foto</CardTitle>
                <CardDescription className="text-primary-foreground/80">Bantu kami menemukan lokasi masalah lebih cepat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem>
                        <FormLabel>Lokasi di Peta</FormLabel>
                        <Card className="bg-white text-card-foreground">
                            <CardContent className="p-4">
                                {location ? (
                                    <div>
                                        <p className="text-sm font-medium">Alamat Teridentifikasi:</p>
                                        <p className="text-sm text-muted-foreground">{location.address}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-center">
                                        <MapPin className="h-8 w-8 mb-2" />
                                        <p>Lokasi belum dipilih</p>
                                        <p className="text-xs">Klik tombol di bawah untuk mendeteksi lokasi Anda.</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button type="button" variant="outline" onClick={handleLocation} disabled={isFetchingLocation} className="w-full text-card-foreground">
                                    {isFetchingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                                    {location ? 'Pilih Ulang Lokasi' : 'Deteksi Lokasi Saya'}
                                </Button>
                            </CardFooter>
                        </Card>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photos"
                  render={() => (
                    <FormItem>
                        <FormLabel>Foto Pendukung</FormLabel>
                        <FormControl>
                            <div>
                                <div 
                                    className="h-32 w-full rounded-md border-2 border-dashed border-primary-foreground/50 flex items-center justify-center cursor-pointer hover:bg-primary-foreground/10 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    {isUploading ? (
                                        <div className="text-center text-primary-foreground/80">
                                            <Loader2 className="mx-auto h-8 w-8 mb-2 animate-spin" />
                                            <p>Mengunggah...</p>
                                        </div>
                                    ) : (
                                        <div className='text-center text-primary-foreground/80'>
                                            <Upload className="mx-auto h-8 w-8 mb-2" />
                                            <p>Seret & lepas file atau klik untuk memilih</p>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                        {photos && photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {photos.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <Image src={url} alt={`Preview ${index + 1}`} width={200} height={150} className="rounded-md object-cover aspect-[4/3]" />
                                        <Button 
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemovePhoto(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FormItem>
                  )}
                 />
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => form.reset()} className="bg-transparent border-[#034032] hover:bg-primary-foreground/10">Batal</Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#034032] text-white hover:bg-primary-foreground/90">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Laporan
            </Button>
        </div>
      </form>
    </Form>
  );
}
