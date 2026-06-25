import { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { MapPin, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/layout/section-heading';
import type { AirportRouteRow } from '@/types/database';

export const metadata: Metadata = {
  title: 'Airport & City Transfers | Divine Travel',
  description: 'Reliable cab transfers between Chennai, Trichy, Madurai, Bangalore and Tirupati. Fixed prices, AC cars, expert drivers for pilgrimages and travel.',
};

export default async function AirportTransfersPage() {
  const supabase = createPublicClient();
  const { data } = await supabase.from('airport_routes').select().eq('is_active', true).order('from_city').returns<AirportRouteRow[]>();
  const routes = data ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-brand-dark">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-25" />
        <div className="container-brand relative z-10 py-20 text-center text-white">
          <Badge className="mb-4 bg-primary/20 text-primary">Airport & City Transfers</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight lg:text-5xl">
            Stress-Free Transfers<br />At Fixed Prices
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Reliable city-to-city cab transfers with AC vehicles, experienced drivers, and transparent pricing. No hidden charges.
          </p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/contact">Book a Transfer</Link>
          </Button>
        </div>
      </section>

      {/* Routes */}
      <section className="py-20">
        <div className="container-brand">
          <SectionHeading
            title="Popular Transfer Routes"
            subtitle="Fixed-price transfers between major cities and pilgrimage destinations"
          />

          {routes.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">Routes coming soon. Contact us for custom transfers.</p>
              <Button asChild className="mt-4"><Link href="/contact">Contact Us</Link></Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {routes.map((route) => (
                <Link
                  key={route.id}
                  href={`/airport-transfers/${route.slug}`}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-brand transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        <MapPin className="h-5 w-5 text-primary" />
                        {route.from_city}
                        <span className="text-muted-foreground">→</span>
                        {route.to_city}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {route.distance_km && (
                          <span className="flex items-center gap-1">
                            <Car className="h-4 w-4" /> {route.distance_km} km
                          </span>
                        )}
                        {route.duration_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> ~{route.duration_hours} hrs
                          </span>
                        )}
                      </div>
                    </div>
                    {route.vehicles.length > 0 && (
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">From</span>
                        <p className="font-heading text-xl font-bold text-primary">
                          ₹{Math.min(...route.vehicles.map((v) => v.price)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>

                  {route.vehicles.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {route.vehicles.map((v, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {v.vehicle_type} — ₹{v.price.toLocaleString('en-IN')}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-sm font-medium text-primary">View details →</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom transfer */}
      <section className="bg-muted/40 py-16">
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
