'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SiteSettingsRow } from '@/types/database';

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
}

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
