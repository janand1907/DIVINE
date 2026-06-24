'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '', mobile: '', email: '', destination: '', travel_date: '',
      adults: 2, children: 0, budget: '', message: '',
      source: 'contact',
    },
  });

  const onSubmit = async (values: LeadInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source: 'contact' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? 'Failed to submit. Please try again.');
        return;
      }
      setSuccess(true);
      form.reset();
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-brand">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">Thank you for reaching out!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our travel expert will contact you within 24 hours via WhatsApp or phone.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
          Submit another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-name">Full Name *</Label>
          <Input id="c-name" placeholder="Your name" {...form.register('name')} />
          {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-mobile">Mobile Number *</Label>
          <Input id="c-mobile" placeholder="+91 98765 43210" {...form.register('mobile')} />
          {form.formState.errors.mobile && <p className="text-xs text-destructive">{form.formState.errors.mobile.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" placeholder="you@email.com" {...form.register('email')} />
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-destination">Destination of Interest</Label>
          <Input id="c-destination" placeholder="e.g., Tirupati, Kerala, Dubai..." {...form.register('destination')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="c-date">Travel Date</Label>
          <Input id="c-date" type="date" {...form.register('travel_date')} />
          {form.formState.errors.travel_date && <p className="text-xs text-destructive">{form.formState.errors.travel_date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-adults">Adults</Label>
          <Input id="c-adults" type="number" min={1} defaultValue={2} {...form.register('adults')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-children">Children</Label>
          <Input id="c-children" type="number" min={0} defaultValue={0} {...form.register('children')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="c-budget">Budget (per person, INR)</Label>
        <Input id="c-budget" placeholder="e.g., ₹10,000 - ₹20,000" {...form.register('budget')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="c-message">Message *</Label>
        <Textarea id="c-message" rows={5} placeholder="Tell us about your travel plans, preferences, and any specific requirements..." {...form.register('message')} />
        {form.formState.errors.message && <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Send Message'}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to be contacted by Divine Travel via WhatsApp / call.
      </p>
    </form>
  );
}
