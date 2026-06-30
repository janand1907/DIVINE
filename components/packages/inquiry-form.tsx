'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Loader as Loader2, CircleCheck as CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface PackageInquiryFormProps {
  packageId: string;
  packageSlug: string;
  packageTitle: string;
  whatsappNumber: string;
}

export function PackageInquiryForm({
  packageId,
  packageSlug,
  packageTitle,
  whatsappNumber,
}: PackageInquiryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [travelDate, setTravelDate] = useState<Date | undefined>();

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      destination: packageTitle,
      travel_date: '',
      adults: 2,
      children: 0,
      budget: '',
      message: `I am interested in "${packageTitle}". Please share details.`,
      source: 'package-inquiry',
      package_id: packageId,
      package_slug: packageSlug,
    },
  });

  const onSubmit = async (values: LeadInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source: 'package-inquiry', travel_date: travelDate ? format(travelDate, 'yyyy-MM-dd') : '' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? 'Failed to submit. Please call us instead.');
        return;
      }
      setSuccess(true);
    } catch {
      setServerError('Network error. Please WhatsApp us instead.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center shadow-brand">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">Inquiry sent!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We will WhatsApp you within 24 hours with details for <strong>{packageTitle}</strong>.
        </p>
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi%20Divine%20Travel%2C%20I%27d%20like%20to%20know%20more%20about%20${encodeURIComponent(packageTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-whatsapp px-4 py-2 text-sm font-medium text-brand-whatsappForeground"
        >
          Talk on WhatsApp now
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-brand"
      id="inquiry-form"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">Inquire about this tour</h3>
      <p className="text-sm text-muted-foreground">
        Fill the form — we will revert within 24 hours via WhatsApp.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="pi-name">Full Name *</Label>
        <Input id="pi-name" placeholder="Your name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pi-mobile">Mobile *</Label>
          <Input id="pi-mobile" placeholder="+91 98765 43210" {...form.register('mobile')} />
          {form.formState.errors.mobile && (
            <p className="text-xs text-destructive">{form.formState.errors.mobile.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-email">Email</Label>
          <Input id="pi-email" type="email" placeholder="you@email.com" {...form.register('email')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Travel Date</Label>
          <DatePicker
            value={travelDate}
            onChange={setTravelDate}
            placeholder="Pick a date"
            fromDate={new Date()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-adults">Adults</Label>
          <Input id="pi-adults" type="number" min={1} {...form.register('adults')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-children">Children</Label>
          <Input id="pi-children" type="number" min={0} {...form.register('children')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-message">Message</Label>
        <Textarea id="pi-message" rows={4} {...form.register('message')} />
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Inquiry'}
      </Button>
    </form>
  );
}
