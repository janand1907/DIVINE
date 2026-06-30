'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/lib/validation/schemas';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Search,
  MessageCircle,
  CircleCheck as CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const CAROUSEL_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Sacred temple at sunrise',
    title: 'Divine Pilgrimage Tours',
    subtitle: 'Spiritual journeys crafted with care',
  },
  {
    src: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Kerala backwaters',
    title: 'Kerala Backwaters',
    subtitle: 'Serene houseboats & lush landscapes',
  },
  {
    src: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Himalayan peaks',
    title: 'Himalayan Escapes',
    subtitle: 'Majestic peaks & mountain valleys',
  },
  {
    src: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Royal Rajasthan palace',
    title: 'Royal Rajasthan',
    subtitle: 'Palaces, forts & golden deserts',
  },
];

const DESTINATIONS = [
  'Navagraha', 'Tirupati', 'Rameswaram', 'Char Dham', 'Kashi',
  'Kerala', 'Ooty', 'Goa', 'Andaman', 'Dubai', 'Singapore', 'Bali', 'Europe',
];

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappNumber: string;
  coverImage?: string | null;
}

export function Hero({ title, subtitle, whatsappNumber }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(current + 1), 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '', mobile: '', email: '', destination: '',
      travel_date: '', adults: undefined, children: 0,
      budget: '', message: '', source: 'quick-quote',
    },
  });

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi, I'd like to plan a tour.`;

  const onSubmit = async (values: LeadInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source: 'quick-quote' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? 'Failed to submit. Please call us instead.');
        return;
      }
      setSuccess(true);
      form.reset();
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative isolate h-[780px] min-h-[600px] overflow-hidden lg:h-[820px]">
      {/* ── Background Slider ─────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <div
            key={img.src}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-in-out',
              idx === current ? 'opacity-100' : 'opacity-0',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Bottom gradient for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* ── Slide captions (top-left area) ────────────────────────────── */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none px-6 lg:px-16">
        <div className="max-w-lg">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            Premium Pilgrimage &amp; Tours
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ── Carousel controls ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:bottom-8">
        {CAROUSEL_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === current ? 'w-8 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70',
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Floating Enquiry Form ──────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-10 lg:pb-14">
        <div className="w-full max-w-3xl rounded-2xl bg-white/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6 lg:rounded-[20px]">
          {success ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                We&apos;ve received your request!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our travel expert will reach out within 24 hours.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setSuccess(false)}>
                Submit another
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Plan Your Perfect Trip
              </p>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Destination */}
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-destination" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <MapPin className="h-3 w-3 text-primary" /> Destination
                    </Label>
                    <select
                      id="hero-destination"
                      className="flex h-11 w-full appearance-none rounded-[var(--radius-md)] border-[1.5px] border-input bg-background px-3 text-sm text-foreground transition-[border-color,box-shadow] hover:border-primary/45 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)] focus:outline-none"
                      {...form.register('destination')}
                    >
                      <option value="">Where do you want to go?</option>
                      {DESTINATIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {form.formState.errors.destination && (
                      <p className="text-[11px] text-destructive">{form.formState.errors.destination.message}</p>
                    )}
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-date" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary" /> Travel Date
                    </Label>
                    <Input
                      id="hero-date"
                      type="date"
                      className="h-11"
                      {...form.register('travel_date')}
                    />
                  </div>

                  {/* Travellers */}
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-travellers" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Users className="h-3 w-3 text-primary" /> Travellers
                    </Label>
                    <Input
                      id="hero-travellers"
                      type="number"
                      min={1}
                      placeholder="e.g. 2"
                      className="h-11"
                      {...form.register('adults', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {serverError && (
                  <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    loading={submitting}
                    size="lg"
                    className="flex-1 gap-2 text-sm font-semibold"
                  >
                    <Search className="h-4 w-4" />
                    Search Tours
                  </Button>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] px-6 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Get Free Quote
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
