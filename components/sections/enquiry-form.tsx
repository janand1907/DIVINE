'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { EnquiryFieldConfig } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
  entityId?: string;
  entityType?: string;
}

export function EnquiryForm({ config, entityId, entityType }: Props) {
  const heading = (config.heading as string) || 'Send an Enquiry';
  const subheading = (config.subheading as string) || '';
  const formKey = (config.form_key as string) || 'contact';
  const layout = (config.layout as string) || 'card';
  const fields = (config.fields as EnquiryFieldConfig[]) || getDefaultFields(formKey);
  const submitLabel = (config.submit_label as string) || 'Submit Enquiry';
  const successMessage = (config.success_message as string) || 'Thank you! We will be in touch shortly.';

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    formData.forEach((v, k) => { values[k] = v.toString(); });

    const body: Record<string, unknown> = {
      name: values.name || '',
      mobile: values.mobile || '',
      email: values.email || '',
      destination: values.destination || '',
      travel_date: values.travel_date || null,
      adults: values.adults ? Number(values.adults) : null,
      children: values.children ? Number(values.children) : null,
      budget: values.budget || '',
      message: values.message || '',
      source: formKey,
      form_key: formKey,
      module_source: entityType || null,
    };

    if (entityType === 'package' || entityType === 'content_page') {
      body.package_id = entityId || null;
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const containerClass = layout === 'card'
    ? 'rounded-lg border border-border bg-card p-6 shadow-sm'
    : '';

  if (submitted) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container-brand">
          <div className={`mx-auto max-w-lg text-center ${containerClass}`}>
            <p className="text-lg font-medium text-foreground">{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        <div className={`mx-auto max-w-lg ${containerClass}`}>
          {heading && (
            <h2 className="mb-1 font-heading text-xl font-bold text-foreground">{heading}</h2>
          )}
          {subheading && (
            <p className="mb-6 text-sm text-muted-foreground">{subheading}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}{field.required && ' *'}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    name={field.key}
                    placeholder={field.placeholder || ''}
                    required={field.required}
                    className="mt-1"
                  />
                ) : field.type === 'select' && field.options ? (
                  <select
                    id={field.key}
                    name={field.key}
                    required={field.required}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.key}
                    name={field.key}
                    type={field.type}
                    placeholder={field.placeholder || ''}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function getDefaultFields(formKey: string): EnquiryFieldConfig[] {
  const base: EnquiryFieldConfig[] = [
    { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
    { key: 'mobile', label: 'Mobile', type: 'tel', required: true, placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Email', type: 'email', required: false, placeholder: 'your@email.com' },
  ];

  if (formKey === 'contact') {
    return [...base, { key: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' }];
  }
  if (formKey === 'quick-quote' || formKey === 'package-inquiry') {
    return [
      ...base,
      { key: 'destination', label: 'Destination', type: 'text', required: false, placeholder: 'Where to?' },
      { key: 'travel_date', label: 'Travel Date', type: 'date', required: false },
      { key: 'adults', label: 'Adults', type: 'number', required: false, min: 1 },
      { key: 'message', label: 'Message', type: 'textarea', required: false },
    ];
  }
  if (formKey === 'vehicle-inquiry') {
    return [
      ...base,
      { key: 'travel_date', label: 'Travel Date', type: 'date', required: false },
      { key: 'destination', label: 'From → To', type: 'text', required: false },
      { key: 'message', label: 'Requirements', type: 'textarea', required: false },
    ];
  }
  if (formKey === 'transfer-inquiry') {
    return [
      ...base,
      { key: 'travel_date', label: 'Pickup Date', type: 'date', required: true },
      { key: 'adults', label: 'Passengers', type: 'number', required: true, min: 1 },
      { key: 'message', label: 'Special Requests', type: 'textarea', required: false },
    ];
  }
  return [...base, { key: 'message', label: 'Message', type: 'textarea', required: false }];
}
