'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader as Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { SiteSettingsRow, FooterLink } from '@/types/database';

interface SiteSettingsFormProps {
  initialValues: SiteSettingsRow;
}

interface FormValues {
  site_url: string;
  default_og_image: string;
  gtm_id: string;
  ga4_id: string;
  meta_pixel_id: string;
  google_search_console_verification: string;
  default_social_title: string;
  default_social_description: string;
  notifications_email: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  social_linkedin: string;
}

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(
    (initialValues.footer_links as FooterLink[]) ?? [],
  );

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      site_url: initialValues.site_url ?? '',
      default_og_image: initialValues.default_og_image ?? '',
      gtm_id: initialValues.gtm_id ?? '',
      ga4_id: initialValues.ga4_id ?? '',
      meta_pixel_id: initialValues.meta_pixel_id ?? '',
      google_search_console_verification: initialValues.google_search_console_verification ?? '',
      default_social_title: initialValues.default_social_title ?? '',
      default_social_description: initialValues.default_social_description ?? '',
      notifications_email: initialValues.notifications_email ?? '',
      social_facebook: initialValues.social_facebook ?? '',
      social_instagram: initialValues.social_instagram ?? '',
      social_twitter: initialValues.social_twitter ?? '',
      social_youtube: initialValues.social_youtube ?? '',
      social_linkedin: initialValues.social_linkedin ?? '',
    },
  });

  const addFooterLink = () =>
    setFooterLinks((prev) => [...prev, { label: '', url: '', open_new_tab: false }]);

  const updateFooterLink = (idx: number, field: keyof FooterLink, value: string | boolean) =>
    setFooterLinks((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    );

  const removeFooterLink = (idx: number) =>
    setFooterLinks((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, footer_links: footerLinks }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to save settings', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success('Site settings saved');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">General</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="site_url">Site URL</Label>
            <Input id="site_url" type="url" placeholder="https://divinetravel.in" {...register('site_url')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default_social_title">Default social title</Label>
            <Input id="default_social_title" {...register('default_social_title')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default_social_description">Default social description</Label>
            <Input id="default_social_description" {...register('default_social_description')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="default_og_image">Default OG image URL</Label>
            <Input id="default_og_image" type="url" {...register('default_og_image')} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Analytics &amp; Tracking</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gtm_id">GTM ID</Label>
            <Input id="gtm_id" placeholder="GTM-XXXXXXX" {...register('gtm_id')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ga4_id">GA4 Measurement ID</Label>
            <Input id="ga4_id" placeholder="G-XXXXXXXXXX" {...register('ga4_id')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="meta_pixel_id">Meta Pixel ID</Label>
            <Input id="meta_pixel_id" placeholder="1234567890" {...register('meta_pixel_id')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="google_search_console_verification">
              Google Search Console verification
            </Label>
            <Input
              id="google_search_console_verification"
              placeholder="google-site-verification=..."
              {...register('google_search_console_verification')}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Social Media Links</h3>
        <p className="mb-4 text-sm text-muted-foreground">Enter full URLs for each social platform. Leave blank to hide from footer.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="social_facebook">Facebook</Label>
            <Input id="social_facebook" type="url" placeholder="https://facebook.com/yourpage" {...register('social_facebook')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="social_instagram">Instagram</Label>
            <Input id="social_instagram" type="url" placeholder="https://instagram.com/yourhandle" {...register('social_instagram')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="social_youtube">YouTube</Label>
            <Input id="social_youtube" type="url" placeholder="https://youtube.com/yourchannel" {...register('social_youtube')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="social_twitter">Twitter / X</Label>
            <Input id="social_twitter" type="url" placeholder="https://twitter.com/yourhandle" {...register('social_twitter')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="social_linkedin">LinkedIn</Label>
            <Input id="social_linkedin" type="url" placeholder="https://linkedin.com/company/yourpage" {...register('social_linkedin')} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Footer Quick Links</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">These links appear in the "Quick Links" column of the footer.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addFooterLink}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Link
          </Button>
        </div>
        {footerLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custom links added. Footer will use default hardcoded links.</p>
        ) : (
          <div className="space-y-3">
            {footerLinks.map((link, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-md border border-border p-3">
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input
                      value={link.label}
                      onChange={(e) => updateFooterLink(idx, 'label', e.target.value)}
                      placeholder="About Us"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateFooterLink(idx, 'url', e.target.value)}
                      placeholder="/about"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Switch
                      checked={link.open_new_tab ?? false}
                      onCheckedChange={(v) => updateFooterLink(idx, 'open_new_tab', v)}
                      id={`open_new_tab_${idx}`}
                    />
                    <Label htmlFor={`open_new_tab_${idx}`} className="text-sm">Open in new tab</Label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFooterLink(idx)}
                  className="mt-1 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Notifications</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="notifications_email">Notifications email</Label>
            <Input
              id="notifications_email"
              type="email"
              placeholder="team@divinetravel.in"
              {...register('notifications_email')}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}
