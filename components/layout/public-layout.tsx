import { fetchSeoContext } from '@/lib/seo/metadata';
import type { Branding } from '@/lib/theme/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';

export interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout shell for public-facing route groups. Composes the sticky header,
 * main content region (with top padding to offset the fixed header), footer,
 * and the floating WhatsApp button.
 *
 * Branding is sourced from Supabase `theme_settings` via `fetchSeoContext`
 * (the same typed helper the root layout uses — internally calls
 * `createServerClient`). The inline `?? '#...'` fallbacks mirror the root
 * layout so the `Branding` literal-typed fields stay satisfied.
 */
export async function PublicLayout({ children }: PublicLayoutProps) {
  const { theme } = await fetchSeoContext('/');

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

  const whatsappNumber = branding.whatsappNumber;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer branding={branding} />
      <WhatsAppFloat phoneNumber={whatsappNumber} />
    </div>
  );
}

export default PublicLayout;
