import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { organizationJsonLd, jsonLdScript } from '@/lib/seo/json-ld';
import { ThemeProvider, type Branding } from '@/lib/theme/theme-provider';
import UtmCookieSetter from '@/components/analytics/utm-cookie-setter';
import AnalyticsHead from '@/components/analytics/analytics-head';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/');
  return buildMetadata({ path: '/', theme, site, seoPage });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme, site } = await fetchSeoContext('/');

  const branding: Branding = {
    primaryColor: theme?.primary_color ?? '#C48A2D',
    secondaryColor: theme?.secondary_color ?? '#8B1E3F',
    accentColor: theme?.accent_color ?? '#F8F4EC',
    darkColor: theme?.dark_color ?? '#1A1A1A',
    successColor: theme?.success_color ?? '#25D366',
    brandName: theme?.brand_name ?? 'Divine Travel',
    logoUrl: theme?.logo_url ?? null,
    whatsappNumber: theme?.whatsapp_number ?? '+919876543210',
    contactPhone: theme?.contact_phone ?? null,
    contactEmail: theme?.contact_email ?? null,
    address: theme?.address ?? null,
  };

  const orgLd = organizationJsonLd({
    brandName: branding.brandName,
    siteUrl: site?.site_url ?? undefined,
    logoUrl: branding.logoUrl,
    phone: branding.contactPhone,
    email: branding.contactEmail,
    address: branding.address,
  });

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider branding={branding}>
          <AnalyticsHead
            gtmId={site?.gtm_id ?? null}
            ga4Id={site?.ga4_id ?? null}
            metaPixelId={site?.meta_pixel_id ?? null}
            gscVerification={site?.google_search_console_verification ?? null}
          />
          {jsonLdScript(orgLd)}
          <UtmCookieSetter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
