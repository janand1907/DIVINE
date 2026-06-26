import { createAdminClient } from '@/lib/supabase/server';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';
import type { SiteSettingsRow } from '@/types/database';

export default async function AdminSiteSettingsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select()
    .eq('id', 1)
    .single<SiteSettingsRow>();

  const settings: SiteSettingsRow = data ?? {
    id: 1,
    site_url: null,
    default_og_image: null,
    gtm_id: null,
    ga4_id: null,
    meta_pixel_id: null,
    google_search_console_verification: null,
    default_social_title: null,
    default_social_description: null,
    notifications_email: null,
    social_facebook: null,
    social_instagram: null,
    social_twitter: null,
    social_youtube: null,
    social_linkedin: null,
    footer_links: [],
    footer_keywords: [],
    footer_tagline: null,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Site Settings</h2>
        <p className="text-sm text-muted-foreground">
          Global analytics, social defaults, and notification preferences.
        </p>
      </div>
      <SiteSettingsForm initialValues={settings} />
    </div>
  );
}
