'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/lib/validation/schemas';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Wallet, ArrowRight, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ── Carousel images ─────────────────────────────────────────────────── */
const CAROUSEL_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Majestic temple at dawn',
    caption: 'Divine Journeys',
  },
  {
    src: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Scenic Kerala backwaters',
    caption: 'Kerala Backwaters',
  },
  {
    src: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Himalayan mountain landscape',
    caption: 'Himalayan Escapes',
  },
  {
    src: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Golden Rajasthan palace',
    caption: 'Royal Rajasthan',
  },
];

const DESTINATIONS = [
  'Navagraha', 'Tirupati', 'Rameswaram', 'Char Dham', 'Kashi',
  'Kerala', 'Ooty', 'Goa', 'Andaman', 'Dubai', 'Singapore', 'Bali', 'Europe',
];

/* ── Hero component ───────────────────────────────────────────────────── */
interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappNumber: string;
  coverImage?: string | null;
}

export function Hero({ title, subtitle, whatsappNumber }: HeroProps) {
  /* Carousel state */
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    setTimeout(() => setAnimating(false), 500);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(current + 1), 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  /* Form state */
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
    <section className="relative isolate overflow-hidden bg-[rgb(var(--dark-rgb))] min-h-[100dvh] flex items-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[rgb(var(--dark-rgb))] via-[rgb(var(--dark-rgb))/95] to-[rgb(var(--secondary-rgb))/30]" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="container-brand relative z-10 grid grid-cols-1 items-center gap-10 py-24 pt-32 lg:grid-cols-2 lg:gap-16 lg:py-28">

        {/* ── Left: Form card ────────────────────────────────────────────── */}
        <div className="animate-fade-up order-2 lg:order-1">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 ring-1 ring-primary/30">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Premium Pilgrimage & Tours</span>
          </div>

          <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/70 leading-relaxed">
            {subtitle}
          </p>

          {/* Enquiry card */}
          <div className="mt-8 rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-xl)] sm:p-7">
            {success ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">We got your request!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our travel expert will reach out within 24 hours via WhatsApp or call.
                </p>
                <Button variant="outline" className="mt-5" onClick={() => setSuccess(false)}>
                  Submit another
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-lg font-semibold text-foreground">Plan Your Journey</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Free quote within 24 hours</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
                  {/* Row 1: Destination */}
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-destination" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Destination
                    </Label>
                    <select
                      id="hero-destination"
                      className="flex h-11 w-full appearance-none rounded-[var(--radius-md)] border-[1.5px] border-input bg-white px-4 text-sm text-foreground transition-[border-color,box-shadow] hover:border-primary/45 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)] focus:outline-none disabled:opacity-60"
                      {...form.register('destination')}
                    >
                      <option value="">Select a destination</option>
                      {DESTINATIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 2: Check-in / Check-out */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-checkin" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Check In
                      </Label>
                      <Input
                        id="hero-checkin"
                        type="date"
                        {...form.register('travel_date')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-checkout" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Check Out
                      </Label>
                      <Input id="hero-checkout" type="date" />
                    </div>
                  </div>

                  {/* Row 3: Travellers / Budget */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-adults" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Users className="h-3.5 w-3.5 text-primary" /> Travellers
                      </Label>
                      <Input
                        id="hero-adults"
                        type="number"
                        min={1}
                        placeholder="2 adults"
                        {...form.register('adults')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-budget" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Wallet className="h-3.5 w-3.5 text-primary" /> Budget
                      </Label>
                      <Input
                        id="hero-budget"
                        placeholder="₹ Per person"
                        {...form.register('budget')}
                      />
                    </div>
                  </div>

                  {/* Name + Mobile (compact) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name *</Label>
                      <Input id="hero-name" placeholder="Your name" {...form.register('name')} />
                      {form.formState.errors.name && (
                        <p className="text-[11px] text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hero-mobile" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile *</Label>
                      <Input id="hero-mobile" placeholder="+91 98765 43210" {...form.register('mobile')} />
                      {form.formState.errors.mobile && (
                        <p className="text-[11px] text-destructive">{form.formState.errors.mobile.message}</p>
                      )}
                    </div>
                  </div>

                  {serverError && (
                    <p className="rounded-[var(--radius-md)] bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
                  )}

                  <Button type="submit" loading={submitting} className="w-full gap-2 text-sm" size="lg">
                    {!submitting && <ArrowRight className="h-4 w-4" />}
                    Search & Get Quote
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Image carousel ───────────────────────────────────────── */}
        <div className="animate-fade-up order-1 lg:order-2" style={{ animationDelay: '0.15s' }}>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            {/* Images */}
            <div className="relative aspect-[4/3] w-full md:aspect-[16/11] lg:aspect-[4/5]">
              {CAROUSEL_IMAGES.map((img, idx) => (
                <div
                  key={img.src}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
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

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-heading text-lg font-semibold text-white">
                  {CAROUSEL_IMAGES[current].caption}
                </p>
                {/* Dot indicators */}
                <div className="mt-2.5 flex gap-1.5">
                  {CAROUSEL_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goTo(idx)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Nav arrows */}
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Trust pills below carousel */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['10,000+ Happy Travelers', '4.9★ Rated', '15+ Years Experience'].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-sm ring-1 ring-white/15"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
