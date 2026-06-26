import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Users, Briefcase, Wind, Phone, MessageCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageRenderer } from '@/components/sections/page-renderer';
import type { VehicleRow } from '@/types/database';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('vehicles').select('name,seo_title,seo_description,og_image').eq('slug', params.slug).eq('is_published', true).single();
  if (!data) return { title: 'Vehicle Not Found' };
  const { theme, site, seoPage } = await fetchSeoContext(`/vehicle-rentals/${params.slug}`);
  return buildMetadata({
    path: `/vehicle-rentals/${params.slug}`,
    title: data.seo_title ?? `${data.name} Rental`,
    description: data.seo_description ?? `Hire ${data.name} for pilgrimage, airport transfers, and travel across South India.`,
    ogImage: data.og_image ?? undefined,
    theme, site, seoPage,
  });
}

export default async function VehicleDetailPage({ params }: Props) {
  const supabase = createPublicClient();
  const [{ data }, { theme }] = await Promise.all([
    supabase.from('vehicles').select().eq('slug', params.slug).eq('is_published', true).single<VehicleRow>(),
    fetchSeoContext(`/vehicle-rentals/${params.slug}`),
  ]);
  if (!data) notFound();

  const v = data;
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const waMsg = encodeURIComponent(`Hi, I'd like to hire the ${v.name}. Please share availability and pricing.`);
  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${waMsg}`;

  return (
    <PageRenderer
      entityType="vehicle"
      entityId={v.id}
      fallback={
        <>
          <div className="bg-muted/40 py-4">
            <div className="container-brand">
              <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Vehicle Rentals', href: '/vehicle-rentals' }, { name: v.name, href: '#' }]} />
            </div>
          </div>

          <section className="py-12">
            <div className="container-brand">
              <div className="grid gap-10 lg:grid-cols-3">
                {/* Main */}
                <div className="space-y-8 lg:col-span-2">
                  {/* Image */}
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                    {v.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.cover_image} alt={v.name} className="h-80 w-full object-cover" />
                    ) : (
                      <div className="flex h-80 items-center justify-center text-6xl">&#128663;</div>
                    )}
                  </div>

                  {/* Title & specs */}
                  <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">{v.name}</h1>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <span className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-primary" /> {v.seats} Seats
                      </span>
                      <span className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                        <Briefcase className="h-4 w-4 text-primary" /> {v.luggage_capacity} Luggage
                      </span>
                      {v.is_ac && (
                        <span className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                          <Wind className="h-4 w-4 text-primary" /> Air Conditioned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {v.description && (
                    <div>
                      <h2 className="mb-3 font-heading text-xl font-semibold">About this Vehicle</h2>
                      <p className="leading-relaxed text-muted-foreground">{v.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  {v.features.length > 0 && (
                    <div>
                      <h2 className="mb-4 font-heading text-xl font-semibold">Features & Amenities</h2>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {v.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                            <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar — Pricing & CTA */}
                <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-brand">
                    <h3 className="font-heading text-lg font-semibold text-foreground">Pricing</h3>
                    <div className="mt-4 space-y-3">
                      {v.starting_price && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Starting from</span>
                          <span className="font-heading text-2xl font-bold text-primary">&#8377;{v.starting_price.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {v.price_per_km && (
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                          <span className="text-sm text-muted-foreground">Per KM</span>
                          <span className="font-medium text-foreground">&#8377;{v.price_per_km}/km</span>
                        </div>
                      )}
                      {v.price_per_day && (
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                          <span className="text-sm text-muted-foreground">Per Day</span>
                          <span className="font-medium text-foreground">&#8377;{v.price_per_day.toLocaleString('en-IN')}/day</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">* Final pricing depends on distance, duration, and route. Contact us for exact quote.</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-brand">
                    <h3 className="mb-4 font-heading text-lg font-semibold">Book This Vehicle</h3>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/contact?vehicle=${v.slug}`}>
                          <Phone className="mr-2 h-4 w-4" /> Request a Quote
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground" size="lg">
                        <a href={waHref} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
                        </a>
                      </Button>
                    </div>
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
