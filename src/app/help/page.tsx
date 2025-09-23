import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";


export default function HelpPage() {
  return (
    <div className="bg-[#F0F7F7] dark:bg-background">
        <div className="container py-8 md:py-16">
            <div className="max-w-3xl mx-auto">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Pusat Bantuan</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                    Temukan jawaban atas pertanyaan Anda dan pelajari cara menggunakan Aspirasi Desa.
                    </p>
                </div>
                
                <Card className="bg-[#034032] text-primary-foreground border-none">
                    <CardHeader>
                        <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Bagaimana cara membuat laporan?</AccordionTrigger>
                            <AccordionContent className="text-primary-foreground/80">
                            Anda dapat membuat laporan dengan mengklik tombol "Ajukan Laporan Baru" di dashboard Anda. Isi semua kolom yang diperlukan, seperti judul, deskripsi, lokasi, dan jangan lupa unggah foto sebagai bukti.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Siapa saja yang bisa melihat laporan saya?</AccordionTrigger>
                            <AccordionContent className="text-primary-foreground/80">
                            Laporan Anda akan dapat dilihat oleh admin (pemerintah desa) untuk diverifikasi dan ditindaklanjuti. Warga lain mungkin dapat melihat lokasi masalah di peta umum tanpa detail pribadi Anda.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Bagaimana cara melacak status laporan?</AccordionTrigger>
                            <AccordionContent className="text-primary-foreground/80">
                            Semua laporan yang Anda buat akan muncul di halaman "Laporan Saya". Anda dapat melihat status terkininya di sana, mulai dari 'pending', 'in_progress', hingga 'resolved'.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-b-0">
                            <AccordionTrigger>Apa saja status laporan dan artinya?</AccordionTrigger>
                            <AccordionContent className="text-primary-foreground/80">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Pending:</strong> Laporan Anda telah diterima sistem dan sedang menunggu verifikasi oleh admin.</li>
                                    <li><strong>In Progress:</strong> Laporan Anda telah diverifikasi dan sedang dalam proses penanganan oleh tim terkait.</li>
                                    <li><strong>Resolved:</strong> Masalah yang Anda laporkan telah selesai ditangani.</li>
                                    <li><strong>Rejected:</strong> Laporan Anda ditolak, mungkin karena informasi tidak lengkap atau bukan wewenang kami.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="mt-8 bg-[#034032] text-primary-foreground border-none">
                    <CardHeader>
                        <CardTitle>Video Tutorial: Cara Mengajukan Laporan</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Tonton video di bawah ini untuk panduan langkah demi langkah.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-white rounded-lg flex items-center justify-center overflow-hidden">
                             <p className="text-muted-foreground">Placeholder Video YouTube</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
