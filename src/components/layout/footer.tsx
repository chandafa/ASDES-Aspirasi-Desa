import Link from 'next/link';
import { Logo } from '../shared/logo';

export function Footer() {
  return (
    <footer className="bg-[#034032] text-primary-foreground rounded-t-3xl">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-xs sm:text-sm leading-loose text-primary-foreground/80 md:text-left">
            Dibangun untuk memajukan desa.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/80">
          &copy; {new Date().getFullYear()} Aspirasi Desa. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
