import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function HelpPage() {
  return (
    <div className="container py-8">
        <div className="max-w-3xl mx-auto">
            <div className="space-y-2 mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Pusat Bantuan</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                Temukan jawaban atas pertanyaan Anda dan pelajari cara menggunakan Aspirasi Desa.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Bagaimana cara membuat laporan?</AccordionTrigger>
                        <AccordionContent>
                        Anda dapat membuat laporan dengan mengklik tombol "Ajukan Laporan" di halaman utama atau dashboard Anda, lalu mengisi formulir yang disediakan.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Siapa saja yang bisa melihat laporan saya?</AccordionTrigger>
                        <AccordionContent>
                        Laporan Anda akan dapat dilihat oleh admin (pemerintah desa) untuk diverifikasi dan ditindaklanjuti. Warga lain mungkin dapat melihat lokasi masalah di peta umum tanpa detail pribadi Anda.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Bagaimana cara melacak status laporan?</AccordionTrigger>
                        <AccordionContent>
                        Semua laporan yang Anda buat akan muncul di dashboard Anda. Anda dapat melihat status terkininya di sana, mulai dari 'pending', 'in_progress', hingga 'resolved'.
                        </AccordionContent>
                    </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Video Tutorial</CardTitle>
                    <CardDescription>Tonton video di bawah ini untuk panduan langkah demi langkah.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Placeholder Video YouTube</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
