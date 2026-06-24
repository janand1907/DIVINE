import type { DestinationRow, HomepageSection, PackageRow, TestimonialRow, BlogRow } from '@/types/database';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { DestinationSection } from '@/components/home/destination-section';
import { FeaturedPackages } from '@/components/home/featured-packages';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { TestimonialsSection } from '@/components/home/testimonials';
import { BlogSection } from '@/components/home/blog-section';
import { ContactCta } from '@/components/home/contact-cta';

export interface HomepageRenderData {
  whatsappNumber: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  divineDestinations: DestinationRow[];
  domesticDestinations: DestinationRow[];
  internationalDestinations: DestinationRow[];
  featuredPackages: PackageRow[];
  testimonials: TestimonialRow[];
  blogs: BlogRow[];
}

interface RenderSectionArgs {
  section: HomepageSection;
  data: HomepageRenderData;
}

function cfg<T = Record<string, unknown>>(section: HomepageSection, fallback: T): T {
  return { ...fallback, ...((section.config as Record<string, unknown>) ?? {}) } as T;
}

export function renderHomepageSection({ section, data }: RenderSectionArgs) {
  switch (section.section_key) {
    case 'hero': {
      const c = cfg<{ title: string; subtitle: string; cta_label: string }>(section, {
        title: 'Sacred Journeys Across India',
        subtitle: 'Handcrafted pilgrimage and leisure tours from Chennai',
        cta_label: 'Get a Free Quote',
      });
      return (
        <Hero
          title={c.title}
          subtitle={c.subtitle}
          ctaLabel={c.cta_label}
          whatsappNumber={data.whatsappNumber as string}
        />
      );
    }
    case 'trust_bar': {
      const c = cfg<{ travelers: string; rating: string; packages: string; years: string }>(section, {
        travelers: '10,000+',
        rating: '4.9',
        packages: '500+',
        years: '15',
      });
      return <TrustBar stats={{ travelers: c.travelers, rating: c.rating, packages: c.packages, years: c.years }} />;
    }
    case 'divine_tours': {
      const c = cfg<{ heading: string; subheading?: string }>(section, {
        heading: 'Divine Tours',
        subheading: 'Spiritual journeys to sacred temples',
      });
      return (
        <DestinationSection
          heading={c.heading}
          subheading={c.subheading}
          destinations={data.divineDestinations}
          basePath="/divine-tours"
        />
      );
    }
    case 'domestic_tours': {
      const c = cfg<{ heading: string; subheading?: string }>(section, {
        heading: 'Domestic Tours',
        subheading: 'Explore the length and breadth of India',
      });
      return (
        <DestinationSection
          heading={c.heading}
          subheading={c.subheading}
          destinations={data.domesticDestinations}
          basePath="/domestic-tours"
        />
      );
    }
    case 'international_tours': {
      const c = cfg<{ heading: string; subheading?: string }>(section, {
        heading: 'International Tours',
        subheading: 'World-class experiences abroad',
      });
      return (
        <DestinationSection
          heading={c.heading}
          subheading={c.subheading}
          destinations={data.internationalDestinations}
          basePath="/international-tours"
        />
      );
    }
    case 'featured_packages': {
      const c = cfg<{ heading: string }>(section, { heading: 'Featured Packages' });
      return <FeaturedPackages heading={c.heading} packages={data.featuredPackages} />;
    }
    case 'why_choose_us': {
      const c = cfg<{ heading: string }>(section, { heading: 'Why Choose Us' });
      return <WhyChooseUs heading={c.heading} />;
    }
    case 'testimonials': {
      const c = cfg<{ heading: string }>(section, { heading: 'Traveler Stories' });
      return <TestimonialsSection heading={c.heading} testimonials={data.testimonials} />;
    }
    case 'blog_section': {
      const c = cfg<{ heading: string }>(section, { heading: 'From the Blog' });
      return <BlogSection heading={c.heading} posts={data.blogs} />;
    }
    case 'contact_cta': {
      const c = cfg<{ heading: string }>(section, { heading: 'Start Planning Your Trip' });
      return (
        <ContactCta
          heading={c.heading}
          whatsappNumber={data.whatsappNumber as string}
          contactPhone={data.contactPhone}
          contactEmail={data.contactEmail}
          address={data.address}
        />
      );
    }
    default:
      return null;
  }
}

export function renderEnabledSections(sections: HomepageSection[], data: HomepageRenderData) {
  return sections
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.display_order - b.display_order)
    .map((s) => ({ key: s.id, element: renderHomepageSection({ section: s, data }) }));
}
