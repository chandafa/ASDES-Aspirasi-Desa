
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/logo';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      toast({
        title: 'Registrasi Berhasil',
        description: 'Akun Anda telah dibuat.',
      });
      router.push('/dashboard/warga');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registrasi Gagal',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#034032] dark:bg-background">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <Card className="w-full max-w-sm bg-[#F0F7F7] dark:bg-card shadow-none border-none">
          <CardHeader>
            <div className='mb-4 flex justify-center'>
              <Logo />
            </div>
            <CardTitle className="text-2xl text-center">Daftar Akun Baru</CardTitle>
            <CardDescription className="text-center">
              Buat akun untuk mulai melaporkan masalah.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nama Lengkap</Label>
                <Input id="full-name" placeholder="Budi Santoso" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bg-[#034032] hover:bg-[#034032]/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Buat Akun'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{' '}
              <Button variant="link" asChild className='p-0'>
                 <Link href="/auth/login" className="">
                    Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
