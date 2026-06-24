import { fetchHomepageData } from '@/lib/homepage/fetch';
import { renderEnabledSections, type HomepageRenderData } from '@/lib/homepage/registry';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const { theme, site, seoPage } = await fetchSeoContext('/');
  return buildMetadata({ path: '/', theme, site, seoPage });
}

export default async function HomePage() {
  const data = await fetchHomepageData();
  const { theme } = await fetchSeoContext('/');

  const renderData: HomepageRenderData = {
    whatsappNumber: theme?.whatsapp_number ?? '+919876543210',
    contactPhone: theme?.contact_phone ?? null,
    contactEmail: theme?.contact_email ?? null,
    address: theme?.address ?? null,
    divineDestinations: data.divineDestinations,
    domesticDestinations: data.domesticDestinations,
    internationalDestinations: data.internationalDestinations,
    featuredPackages: data.featuredPackages,
    testimonials: data.testimonials,
    blogs: data.blogs,
  };

  const sections = renderEnabledSections(data.sections, renderData);

  return (
    <>
      {sections.map(({ key, element }) => (
        <div key={key}>{element}</div>
      ))}
    </>
  );
}
