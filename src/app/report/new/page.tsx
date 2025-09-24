"use client";

import MainLayout from "@/components/layout/main-layout";
import { ReportForm } from "./report-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function NewReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <MainLayout>
        <div className="bg-[#F0F7F7] dark:bg-background">
            <div className="container py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold font-headline">Ajukan Laporan Baru</h1>
                    <p className="text-muted-foreground">
                        Sampaikan masalah infrastruktur di desa Anda. Isi formulir di bawah ini dengan lengkap.
                    </p>
                    </div>
                    <ReportForm />
                </div>
            </div>
        </div>
    </MainLayout>
  );
}
