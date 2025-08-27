import { HandHeart } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <HandHeart className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline">Aspirasi Desa</span>
    </Link>
  );
}
