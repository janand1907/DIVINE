'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface StickyCtaProps {
  whatsappNumber: string;
  packageName: string;
}

export function StickyCta({ whatsappNumber, packageName }: StickyCtaProps) {
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hi Divine Travel, I am interested in "${packageName}".`,
  )}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="container-brand flex items-center justify-between gap-3">
        <Link
          href="#inquiry-form"
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
        >
          Send Inquiry
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-whatsapp px-4 py-2.5 text-sm font-medium text-brand-whatsappForeground"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
