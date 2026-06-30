import { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { MapPin, Clock, Car, ShieldCheck, Headset, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AirportTransferSearch } from '@/components/airport/airport-transfer-search';
import type { AirportRouteRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/airport-transfers');
  return buildMetadata({
    path: '/airport-transfers',
    title: 'Airport & City Transfers',
    description: 'Reliable cab transfers between Chennai, Trichy, Madurai, Bangalore and Tirupati. Fixed prices, AC cars, expert drivers for pilgrimages and travel.',
    theme, site, seoPage,
  });
}

export default async function AirportTransfersPage() {
  const supabase = createPublicClient();
  const [{ data }, { theme }] = await Promise.all([
    supabase.from('airport_routes').select().eq('is_active', true).order('from_city').returns<AirportRouteRow[]>(),
    fetchSeoContext('/airport-transfers'),
  ]);
  const routes = data ?? [];
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';

  return (
    <>
      {/* ── Hero + Search ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-dark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/80" />

        <div className="container-brand relative z-10 py-16 md:py-24">
          <div className="mb-10 text-center text-white">
            <Badge className="mb-4 bg-primary/20 text-primary">Airport &amp; City Transfers</Badge>
            <h1 className="font-heading text-4xl font-bold leading-tight lg:text-5xl">
              Stress-Free Transfers<br className="hidden sm:block" /> at Fixed Prices
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Search any Indian airport. Instant quotes. No hidden charges.
            </p>
          </div>
          <div className="mx-auto max-w-4xl rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_8px_48px_rgba(0,0,0,0.28)] sm:p-8">
            <AirportTransferSearch routes={routes} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="container-brand">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              { icon: Car, label: 'All AC Vehicles', sub: 'Sedan, SUV & more' },
              { icon: ShieldCheck, label: 'Safe & Verified', sub: 'Insured transport' },
              { icon: Star, label: 'Fixed Pricing', sub: 'No hidden charges' },
              { icon: Headset, label: '24/7 Support', sub: 'Always reachable' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-2 px-4 py-7 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="block text-xs text-muted-foreground">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Routes ─────────────────────────────────────────────────── */}
      {routes.length > 0 && (
        <section className="section-py bg-background">
          <div className="container-brand">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Popular Routes</span>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Fixed-Price Transfer Routes
              </h2>
              <p className="mt-2 text-muted-foreground">Pre-priced routes between major cities and pilgrimage destinations.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <Link
                  key={route.id}
                  href={`/airport-transfers/${route.slug}`}
                  className="group rounded-[var(--radius-lg)] border border-border bg-white p-5 shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-center gap-2 font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{route.from_city}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="truncate">{route.to_city}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {route.distance_km && (
                      <span className="flex items-center gap-1">
                        <Car className="h-3.5 w-3.5" /> {route.distance_km} km
                      </span>
                    )}
                    {route.duration_hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> ~{route.duration_hours} hrs
                      </span>
                    )}
                  </div>
                  {route.vehicles.length > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {route.vehicles.slice(0, 2).map((v, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {v.vehicle_type}
                          </Badge>
                        ))}
                      </div>
                      <span className="font-heading text-lg font-bold text-primary">
                        ₹{Math.min(...route.vehicles.map((v) => v.price)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Custom transfer CTA ────────────────────────────────────────────── */}
      <section className="bg-muted/40 section-py-sm">
        <div className="container-brand text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Need a Custom Route?</h2>
          <p className="mt-2 text-muted-foreground">We cover all major cities in South India. Contact us for a custom quote.</p>
          <Button asChild className="mt-6">
            <Link href="/contact">Request Custom Transfer</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
