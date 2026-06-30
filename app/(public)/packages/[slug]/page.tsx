import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, MapPin, IndianRupee } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, faqJsonLd, tourPackageJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/layout/json-ld';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeading } from '@/components/layout/section-heading';
import { PackageCard } from '@/components/packages/package-card';
import { Itinerary } from '@/components/packages/itinerary';
import { PricingTable, InclusionList, PackageFaq } from '@/components/packages/package-parts';
import { PackageInquiryForm } from '@/components/packages/inquiry-form';
import { StickyCta } from '@/components/packages/sticky-cta';
import { PageRenderer } from '@/components/sections/page-renderer';
import type { PackageRow } from '@/types/database';
export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<PackageRow>();
  if (!pkg) return { title: 'Package not found' };

  const { theme, site, seoPage } = await fetchSeoContext(`/packages/${params.slug}`);
  return buildMetadata({
    path: `/packages/${params.slug}`,
    title: pkg.seo_title ?? pkg.title,
    description: pkg.seo_description ?? pkg.overview.slice(0, 160),
    ogImage: pkg.og_image ?? pkg.cover_image ?? undefined,
    canonicalPath: pkg.canonical_path ?? `/packages/${params.slug}`,
    theme, site, seoPage,
  });
}

export default async function PackageDetailPage({ params }: Props) {
  const supabase = createPublicClient();
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<PackageRow>();

  if (!pkg) notFound();

  const { theme, site } = await fetchSeoContext(`/packages/${params.slug}`);
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const brandName = theme?.brand_name ?? 'Divine Travel';
  const siteUrl = site?.site_url ?? undefined;

  // Related packages: same category, excluding current.
  const { data: related } = await supabase
    .from('packages')
    .select('*')
    .eq('is_published', true)
    .neq('id', pkg.id)
    .eq(pkg.category_id ? 'category_id' : 'is_published', pkg.category_id ?? true)
    .limit(3)
    .returns<PackageRow[]>();

  const cover = pkg.cover_image ?? pkg.gallery?.[0] ?? 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1600';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Packages', url: '/packages' },
    { name: pkg.title, url: `/packages/${pkg.slug}` },
  ];

  const visualBreadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: pkg.title, href: `/packages/${pkg.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={tourPackageJsonLd(pkg, brandName, siteUrl)} />
      {pkg.faqs.length > 0 && <JsonLd data={faqJsonLd(pkg.faqs)} />}

      <PageRenderer
        entityType="package"
        entityId={pkg.id}
        fallback={
          <>
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-brand-dark text-brand-darkForeground">
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${cover})` }}
                aria-hidden
              />
              <div className="container-brand py-16 md:py-24">
                <div className="max-w-3xl">
                  <Breadcrumb items={visualBreadcrumbs.slice(0, 2)} siteUrl={siteUrl} className="text-brand-darkForeground/80 [&_*]:text-brand-darkForeground/80" />
                  <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl text-balance">
                    {pkg.title}
                  </h1>
                  {pkg.subtitle && (
                    <p className="mt-3 text-lg text-brand-darkForeground/85 text-balance">{pkg.subtitle}</p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
                    {pkg.duration_days > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {pkg.duration_days}D / {pkg.duration_nights}N
                      </span>
                    )}
                    {pkg.destinations.length > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {pkg.destinations.slice(0, 3).join(', ')}
                        {pkg.destinations.length > 3 ? ` +${pkg.destinations.length - 3}` : ''}
                      </span>
                    )}
                    {pkg.starting_price != null && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <IndianRupee className="h-4 w-4" />
                        {pkg.starting_price.toLocaleString('en-IN')} onwards
                      </span>
                    )}
                  </div>
                  {pkg.highlights.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 5).map((h, i) => (
                        <li key={i} className="rounded-full bg-white/10 px-3 py-1 text-xs">{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Main layout */}
            <section className="bg-background py-12">
              <div className="container-brand grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
                {/* Content column */}
                <div className="space-y-12">
                  {/* Overview */}
                  <div>
                    <SectionHeading title="Overview" align="left" />
                    <p className="mt-4 whitespace-pre-line text-foreground/90 leading-relaxed">{pkg.overview}</p>
                  </div>

                  {/* Itinerary */}
                  {pkg.itinerary.length > 0 && (
                    <div>
                      <SectionHeading title="Itinerary" align="left" />
                      <div className="mt-4"><Itinerary days={pkg.itinerary} /></div>
                    </div>
                  )}

                  {/* Pricing */}
                  {pkg.pricing.length > 0 && (
                    <div>
                      <SectionHeading title="Pricing" align="left" />
                      <div className="mt-4"><PricingTable pricing={pkg.pricing} /></div>
                    </div>
                  )}

                  {/* Inclusions / Exclusions */}
                  <div>
                    <SectionHeading title="Inclusions &amp; Exclusions" align="left" />
                    <div className="mt-4"><InclusionList inclusions={pkg.inclusions} exclusions={pkg.exclusions} /></div>
                  </div>

                  {/* Gallery */}
                  {pkg.gallery.length > 0 && (
                    <div>
                      <SectionHeading title="Gallery" align="left" />
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {pkg.gallery.map((src, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={src} alt={`${pkg.title} ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQs */}
                  {pkg.faqs.length > 0 && (
                    <div>
                      <SectionHeading title="FAQs" align="left" />
                      <div className="mt-4"><PackageFaq faqs={pkg.faqs} /></div>
                    </div>
                  )}

                  {/* Related packages */}
                  {(related ?? []).length > 0 && (
                    <div>
                      <SectionHeading title="Related Packages" align="left" />
                      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {(related ?? []).map((rp) => (
                          <PackageCard key={rp.id} pkg={rp} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                  <PackageInquiryForm
                    packageId={pkg.id}
                    packageSlug={pkg.slug}
                    packageTitle={pkg.title}
                    whatsappNumber={whatsappNumber}
                  />
                  <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground shadow-brand">
                    <p className="font-medium text-foreground">Prefer to talk?</p>
                    <p>WhatsApp our travel desk for instant assistance.</p>
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi, I want to know more about ${pkg.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-whatsapp px-4 py-2 font-medium text-brand-whatsappForeground"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </aside>
              </div>
            </section>

            <StickyCta whatsappNumber={whatsappNumber} packageName={pkg.title} />
          </>
        }
      />
    </>
  );
}
