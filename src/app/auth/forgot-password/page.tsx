"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/logo';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSent(false);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Email Terkirim',
        description: 'Silakan periksa kotak masuk Anda untuk tautan reset password.',
      });
      setIsSent(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim Email',
        description: "Pastikan email yang Anda masukkan sudah benar dan terdaftar.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className='mb-4 flex justify-center'>
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center">Lupa Password</CardTitle>
          <CardDescription className="text-center">
            {isSent 
              ? "Tautan reset telah dikirim ke email Anda."
              : "Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password Anda."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSent ? (
             <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                    Jika Anda tidak menemukan email, periksa folder spam Anda.
                </p>
                <Button asChild className="w-full">
                    <Link href="/auth/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Login
                    </Link>
                </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Kirim Tautan Reset'}
              </Button>
               <Button variant="ghost" asChild>
                    <Link href="/auth/login">
                         <ArrowLeft className="mr-2 h-4 w-4" />
                        Batal
                    </Link>
                </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
