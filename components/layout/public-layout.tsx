import { fetchSeoContext } from '@/lib/seo/metadata';
import { fetchNavWithPool } from '@/lib/nav/fetch';
import type { Branding } from '@/lib/theme/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export async function PublicLayout({ children }: PublicLayoutProps) {
  const [{ theme }, { menus: navMenus, pool }] = await Promise.all([
    fetchSeoContext('/'),
    fetchNavWithPool(),
  ]);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header navMenus={navMenus} pool={pool} />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer branding={branding} />
      <WhatsAppFloat phoneNumber={branding.whatsappNumber} />
    </div>
  );
}

export default PublicLayout;
