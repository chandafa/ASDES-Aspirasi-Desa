import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, FileText } from 'lucide-react';
import { Logo } from '../shared/logo';
import { ThemeToggle } from '../shared/theme-toggle';
import { UserNav } from './user-nav';

export function Header() {
  const navItems = [
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
              <nav className="grid gap-2 p-4">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center py-2 text-lg font-semibold">
                    {item.label}
                  </Link>
                ))}
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
                <Button asChild>
                    <Link href="/report/new">
                        <FileText className="mr-2 h-4 w-4" />
                        Buat Laporan
                    </Link>
                </Button>
                <ThemeToggle />
                <UserNav />
            </div>
        </div>
      </div>
    </header>
  );
}
