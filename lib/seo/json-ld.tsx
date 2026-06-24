import type {
  BlogRow,
  FaqItem,
  HomepageSection,
  PackageRow,
  ThemeSettingsRow,
} from '@/types/database';

interface OrganizationLdArgs {
  brandName: string;
  siteUrl?: string;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export function organizationJsonLd(args: OrganizationLdArgs) {
  const domain = args.siteUrl ? new URL(args.siteUrl).origin : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: args.brandName,
    url: args.siteUrl ?? domain,
    ...(args.logoUrl ? { logo: args.logoUrl, image: args.logoUrl } : {}),
    ...(args.phone ? { telephone: args.phone } : {}),
    ...(args.email ? { email: args.email } : {}),
    ...(args.address
      ? { address: { '@type': 'PostalAddress', streetAddress: args.address, addressLocality: 'Chennai', addressCountry: 'IN' } }
      : {}),
    areaServed: { '@type': 'Country', name: 'India' },
    priceRange: '₹₹',
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function tourPackageJsonLd(pkg: PackageRow, brandName: string, siteUrl?: string) {
  const origin = siteUrl ? new URL(siteUrl).origin : '';
  const canonical = pkg.canonical_path ?? `/packages/${pkg.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.seo_description ?? pkg.overview.slice(0, 200),
    url: `${origin}${canonical}`,
    provider: {
      '@type': 'TravelAgency',
      name: brandName,
    },
    ...(pkg.starting_price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: pkg.starting_price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    itinerary: pkg.itinerary.map((day) => ({
      '@type': 'ItemList',
      name: `Day ${day.day}: ${day.title}`,
      description: day.description,
    })),
    ...(pkg.cover_image ? { image: pkg.cover_image } : {}),
  };
}

export function articleJsonLd(blog: BlogRow, brandName: string, siteUrl?: string) {
  const origin = siteUrl ? new URL(siteUrl).origin : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.seo_title ?? blog.title,
    description: blog.seo_description ?? blog.excerpt ?? '',
    image: blog.og_image ?? blog.cover_image ?? undefined,
    author: { '@type': 'Organization', name: blog.author || brandName },
    publisher: { '@type': 'Organization', name: brandName },
    datePublished: blog.published_at ?? blog.created_at,
    dateModified: blog.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${origin}/blog/${blog.slug}`,
    },
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function renderHomepageSections(sections: HomepageSection[]) {
  return sections
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.display_order - b.display_order);
}
