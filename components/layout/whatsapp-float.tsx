'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface WhatsAppFloatProps {
  /** Phone number in international format, e.g. "+919876543210". */
  phoneNumber?: string;
  /** Pre-filled WhatsApp message body. */
  message?: string;
}

const DEFAULT_NUMBER = '+919876543210';
const DEFAULT_MESSAGE =
  'Hi! I would like to enquire about your tour packages.';

/**
 * Floating WhatsApp action button, fixed to the bottom-right of the viewport.
 * Hidden until the visitor scrolls 300px, then animates in. Opens a wa.me deep
 * link with a pre-filled message.
 */
export function WhatsAppFloat({
  phoneNumber = DEFAULT_NUMBER,
  message = DEFAULT_MESSAGE,
}: WhatsAppFloatProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const normalized = phoneNumber.replace(/[^\d]/g, '');
  const href = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        'group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-whatsapp text-brand-whatsappForeground shadow-brand transition-all duration-300',
        'hover:scale-110 hover:bg-brand-whatsapp/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        visible
          ? 'translate-y-0 opacity-100 animate-fade-in'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {/* Subtle ping halo */}
      <span
        aria-hidden="true"
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-whatsapp opacity-40 transition-opacity duration-300 group-hover:opacity-60"
      />
      <MessageCircle className="relative h-7 w-7" aria-hidden="true" />
    </a>
  );
}

export default WhatsAppFloat;
