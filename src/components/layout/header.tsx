
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, FileText, Map } from 'lucide-react';
import { Logo } from '../shared/logo';
import { ThemeToggle } from '../shared/theme-toggle';
import { UserNav } from './user-nav';
import { GlobalSearch } from '../shared/global-search';

export function Header() {
  const navItems = [
    { href: '/map', label: 'Peta Masalah' },
    { href: '/blog', label: 'Blog' },
    { href: '/help', label: 'Bantuan' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto hidden md:flex">
          <Logo />
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="p-4">
                <Logo />
              </div>
              <nav className="grid gap-4 p-4">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center py-2 text-lg font-semibold">
                    {item.label}
                  </Link>
                ))}
                <Button asChild className='bg-[#034032] text-white hover:bg-[#034032]/90'>
                    <Link href="/report/new">
                        <FileText className="mr-2 h-4 w-4" />
                        Buat Laporan
                    </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            
            <nav className="hidden md:flex md:gap-4">
                {navItems.map((item) => (
                    <Button key={item.label} variant="link" asChild className="text-foreground/80 hover:text-foreground">
                        <Link href={item.href}>{item.label}</Link>
                    </Button>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <GlobalSearch />
                <div className="hidden md:flex">
                    <Button asChild className='bg-[#034032] text-white hover:bg-[#034032]/90'>
                        <Link href="/report/new">
                            <FileText className="mr-2 h-4 w-4" />
                            Buat Laporan
                        </Link>
                    </Button>
                </div>
                <ThemeToggle />
                <UserNav />
            </div>
        </div>
      </div>
    </header>
  );
}
