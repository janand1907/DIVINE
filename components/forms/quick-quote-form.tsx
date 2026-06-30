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

interface QuickQuoteFormProps {
  destinationPreset?: string;
  packageId?: string;
  packageSlug?: string;
  compact?: boolean;
}

const DESTINATIONS = [
  'Navagraha', 'Tirupati', 'Rameswaram', 'Char Dham', 'Kashi', 'Kailash Mansarovar',
  'Kerala', 'Ooty', 'Goa', 'Andaman', 'Dubai', 'Singapore', 'Bali', 'Europe',
];

export function QuickQuoteForm({ destinationPreset, packageId, packageSlug, compact }: QuickQuoteFormProps) {
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
      destination: destinationPreset ?? '',
      travel_date: '',
      adults: undefined,
      children: 0,
      budget: '',
      message: '',
      source: 'quick-quote',
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
        body: JSON.stringify({ ...values, source: 'quick-quote', travel_date: travelDate ? format(travelDate, 'yyyy-MM-dd') : '' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? 'Failed to submit. Please call us instead.');
        return;
      }
      setSuccess(true);
      form.reset();
    } catch {
      setServerError('Network error. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center shadow-brand">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our travel expert will reach out within 24 hours via WhatsApp or call.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="qq-name">Full Name *</Label>
          <Input id="qq-name" placeholder="Your name" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qq-mobile">Mobile Number *</Label>
          <Input id="qq-mobile" placeholder="+91 98765 43210" {...form.register('mobile')} />
          {form.formState.errors.mobile && (
            <p className="text-xs text-destructive">{form.formState.errors.mobile.message}</p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="qq-email">Email</Label>
            <Input id="qq-email" type="email" placeholder="you@email.com" {...form.register('email')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qq-destination">Destination</Label>
            <select
              id="qq-destination"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              {...form.register('destination')}
            >
              <option value="">Select destination</option>
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

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
          <Label htmlFor="qq-adults">Adults</Label>
          <Input id="qq-adults" type="number" min={1} placeholder="2" {...form.register('adults')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qq-children">Children</Label>
          <Input id="qq-children" type="number" min={0} placeholder="0" {...form.register('children')} />
        </div>
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <Label htmlFor="qq-message">Message (optional)</Label>
          <Textarea id="qq-message" rows={3} placeholder="Tell us about your travel preferences..." {...form.register('message')} />
        </div>
      )}

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Get Free Quote'}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to be contacted by Divine Travel via WhatsApp / call.
      </p>
    </form>
  );
}
