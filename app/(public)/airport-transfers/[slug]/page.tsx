import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { MapPin, Clock, Car, Users, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageRenderer } from '@/components/sections/page-renderer';
import type { AirportRouteRow } from '@/types/database';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('airport_routes').select('from_city,to_city,seo_title,seo_description,og_image').eq('slug', params.slug).eq('is_active', true).single();
  if (!data) return { title: 'Route Not Found' };
  return {
    title: data.seo_title ?? `${data.from_city} to ${data.to_city} Transfer | Divine Travel`,
    description: data.seo_description ?? `Book AC cab from ${data.from_city} to ${data.to_city}. Fixed prices, expert drivers. Ideal for Tirupati pilgrimage and travel.`,
    openGraph: { images: data.og_image ? [data.og_image] : [] },
  };
}

export default async function AirportTransferDetailPage({ params }: Props) {
  const supabase = createPublicClient();
  const { data } = await supabase.from('airport_routes').select().eq('slug', params.slug).eq('is_active', true).single<AirportRouteRow>();
  if (!data) notFound();

  const route = data;
  const waMsg = encodeURIComponent(`Hi, I need a transfer from ${route.from_city} to ${route.to_city}. Please share availability and pricing.`);
  const waHref = `https://wa.me/919876543210?text=${waMsg}`;

  return (
    <PageRenderer
      entityType="route"
      entityId={route.id}
      fallback={
        <>
          <div className="bg-muted/40 py-4">
            <div className="container-brand">
              <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Airport Transfers', href: '/airport-transfers' }, { name: `${route.from_city} \u2192 ${route.to_city}`, href: '#' }]} />
            </div>
          </div>

          {/* Hero */}
          <section className="bg-brand-dark py-16 text-white">
            <div className="container-brand">
              <Badge className="mb-4 bg-primary/20 text-primary">Airport Transfer</Badge>
              <h1 className="font-heading text-3xl font-bold lg:text-5xl">
                {route.from_city} to {route.to_city}
              </h1>
              <div className="mt-4 flex flex-wrap gap-6 text-white/70">
                {route.distance_km && (
                  <span className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> {route.distance_km} km</span>
                )}
                {route.duration_hours && (
                  <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> ~{route.duration_hours} hours</span>
                )}
                <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> South India</span>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container-brand">
              <div className="grid gap-10 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                  {route.description && (
                    <div>
                      <h2 className="mb-3 font-heading text-xl font-semibold">About This Route</h2>
                      <p className="leading-relaxed text-muted-foreground">{route.description}</p>
                    </div>
                  )}

                  <div>
                    <h2 className="mb-4 font-heading text-xl font-semibold">Vehicle Options &amp; Pricing</h2>
                    {route.vehicles.length === 0 ? (
                      <p className="text-muted-foreground">Contact us for pricing on this route.</p>
                    ) : (
                      <div className="space-y-3">
                        {route.vehicles.map((v, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-brand">
                            <div>
                              <p className="font-semibold text-foreground">{v.vehicle_type}</p>
                              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-3.5 w-3.5" /> Up to {v.seats} passengers
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-heading text-2xl font-bold text-primary">&#8377;{v.price.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-muted-foreground">One way</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inclusions */}
                  <div className="rounded-xl bg-muted/40 p-6">
                    <h3 className="mb-3 font-heading text-lg font-semibold">What&apos;s Included</h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {['AC Vehicle', 'Experienced Driver', 'Fuel Charges', 'Toll Charges', '24/7 Support', 'GST'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">&#10003;</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Booking sidebar */}
                <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-brand">
                    <h3 className="mb-4 font-heading text-lg font-semibold">Book This Transfer</h3>
                    {route.vehicles.length > 0 && (
                      <p className="mb-4 text-sm text-muted-foreground">
                        Prices from <span className="font-bold text-primary text-base">&#8377;{Math.min(...route.vehicles.map((v) => v.price)).toLocaleString('en-IN')}</span>
                      </p>
                    )}
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/contact?route=${route.slug}`}>
                          <Phone className="mr-2 h-4 w-4" /> Get Quote
                        </Link>
                      </Button>
                      <Button asChild size="lg" className="w-full bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground">
                        <a href={waHref} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-xl bg-primary/5 p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Prices are for one-way transfers. Return trips attract additional charges. Contact us for round-trip packages.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
