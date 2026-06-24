import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappNumber: string;
  coverImage?: string | null;
}

export function Hero({ title, subtitle, ctaLabel, whatsappNumber }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-brand-darkForeground">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-brand-dark/70" aria-hidden />

      <div className="container-brand flex min-h-[34rem] flex-col justify-center py-24">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/30">
            Premium Pilgrimage & Tours
          </span>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-darkForeground/80">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi%20Divine%20Travel%2C%20I%27d%20like%20to%20plan%20a%20trip`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-whatsapp px-6 py-3 font-medium text-brand-whatsappForeground transition hover:brightness-95"
            >
              <Search className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
