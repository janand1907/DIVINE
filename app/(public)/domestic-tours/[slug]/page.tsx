import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeading } from '@/components/layout/section-heading';
import { PackageCard } from '@/components/packages/package-card';
import type { DestinationRow, PackageRow } from '@/types/database';
export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: dest } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .eq('region', 'domestic')
    .eq('is_published', true)
    .maybeSingle<DestinationRow>();
  if (!dest) return { title: 'Destination not found' };

  const { theme, site, seoPage } = await fetchSeoContext(`/domestic-tours/${params.slug}`);
  return buildMetadata({
    path: `/domestic-tours/${params.slug}`,
    title: dest.seo_title ?? dest.name,
    description: dest.seo_description ?? dest.description ?? undefined,
    ogImage: dest.cover_image ?? undefined,
    theme, site, seoPage,
  });
}

export default async function DomesticTourDetailPage({ params }: Props) {
  const supabase = createPublicClient();
  const { data: dest } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .eq('region', 'domestic')
    .eq('is_published', true)
    .maybeSingle<DestinationRow>();

  if (!dest) notFound();

  const { theme, site } = await fetchSeoContext(`/domestic-tours/${params.slug}`);
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const siteUrl = site?.site_url ?? undefined;

  // Packages where destination_id matches OR highlights contains the destination name.
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_published', true)
    .or(`destination_id.eq.${dest.id},highlights.cs.{${JSON.stringify(dest.name)}}`)
    .order('updated_at', { ascending: false })
    .returns<PackageRow[]>();

  const matchPackages = packages ?? [];

  // If no packages matched the OR filter, fall back to destination_id only.
  let finalPackages = matchPackages;
  if (finalPackages.length === 0) {
    console.warn('[domestic-tours/slug] OR filter returned no rows; falling back to destination_id-only');
    const { data: fallback } = await supabase
      .from('packages')
      .select('*')
      .eq('is_published', true)
      .eq('destination_id', dest.id)
      .order('updated_at', { ascending: false })
      .returns<PackageRow[]>();
    finalPackages = fallback ?? [];
  }

  const cover = dest.cover_image ?? 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1600';
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi, I want to know more about ${dest.name} tours`)}`;

  return (
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
            <Breadcrumb
              items={[
                { name: 'Home', href: '/' },
                { name: 'Domestic Tours', href: '/domestic-tours' },
                { name: dest.name, href: `/domestic-tours/${dest.slug}` },
              ]}
              siteUrl={siteUrl}
              className="text-brand-darkForeground/80 [&_*]:text-brand-darkForeground/80"
            />
            <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl text-balance">
              {dest.name}
            </h1>
            {dest.description && (
              <p className="mt-3 max-w-2xl text-lg text-brand-darkForeground/85 text-balance">
                {dest.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-background py-12">
        <div className="container-brand">
          <SectionHeading
            title={`Tours to ${dest.name}`}
            subtitle="Curated travel packages for this destination"
          />

          {finalPackages.length === 0 ? (
            <div className="mt-10 rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <p className="text-foreground">
                New tours to {dest.name} are being planned. Reach out for a custom itinerary.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-whatsapp px-6 py-2.5 font-medium text-brand-whatsappForeground"
              >
                Enquire on WhatsApp
              </a>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {finalPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
