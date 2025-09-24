"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PwaInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const handleCloseClick = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
      <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Smartphone className="h-8 w-8 shrink-0" />
          <div>
            <h3 className="font-bold">Install Aplikasi</h3>
            <p className="text-sm text-primary-foreground/80">Akses lebih cepat ke website Aspirasi Desa.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstallClick}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shrink-0"
          >
            Install
          </Button>
          <Button
            onClick={handleCloseClick}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
