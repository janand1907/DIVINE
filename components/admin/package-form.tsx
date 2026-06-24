'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { packageSchema, type PackageInput } from '@/lib/validation/schemas';
import type {
  PackageRow,
  PackageCategoryRow,
  DestinationRow,
  PricingOption,
  FaqItem,
} from '@/types/database';

interface PackageFormProps {
  initialValues?: PackageRow;
}

const EMPTY: PackageInput = {
  slug: '',
  title: '',
  subtitle: '',
  category_id: null,
  destination_id: null,
  destinations: [],
  duration_days: 0,
  duration_nights: 0,
  highlights: [],
  overview: '',
  itinerary: [],
  inclusions: [],
  exclusions: [],
  pricing: [],
  starting_price: null,
  gallery: [],
  cover_image: '',
  faqs: [],
  is_featured: false,
  is_published: false,
  seo_title: '',
  seo_description: '',
  og_image: '',
  canonical_path: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
}

const PRICING_PLACEHOLDER = `[
  {
    "label": "Standard",
    "price": "₹25,000",
    "inclusions": ["Hotels", "Breakfast"]
  }
]`;

const FAQS_PLACEHOLDER = `[
  { "question": "What is the best time to visit?", "answer": "..." }
]`;

export function PackageForm({ initialValues }: PackageFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues);
  const [categories, setCategories] = useState<PackageCategoryRow[]>([]);
  const [destinations, setDestinations] = useState<DestinationRow[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pricingText, setPricingText] = useState('');
  const [faqsText, setFaqsText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: initialValues ? (initialValues as unknown as PackageInput) : EMPTY,
  });

  // Pre-fill JSON textareas from initial values.
  useEffect(() => {
    if (initialValues) {
      reset(initialValues as unknown as PackageInput);
    }
    setPricingText(JSON.stringify(initialValues?.pricing ?? [], null, 2));
    setFaqsText(JSON.stringify(initialValues?.faqs ?? [], null, 2));
  }, [initialValues, reset]);

  // Fetch categories + destinations client-side.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [catRes, destRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/destinations'),
        ]);
        if (active) {
          if (catRes.ok) setCategories((await catRes.json()) ?? []);
          if (destRes.ok) setDestinations((await destRes.json()) ?? []);
        }
      } catch {
        // best-effort
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const title = watch('title');
  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(title ?? ''));
    }
  }, [title, slugTouched, setValue]);

  const onSubmit = async (values: PackageInput) => {
    setSubmitting(true);

    // Parse JSON textareas.
    let pricing: PricingOption[] | null = null;
    try {
      pricing = pricingText.trim() === '' ? [] : JSON.parse(pricingText);
      if (!Array.isArray(pricing)) throw new Error('not an array');
    } catch {
      toast.error('Pricing must be valid JSON');
      setSubmitting(false);
      return;
    }
    let faqs: FaqItem[] | null = null;
    try {
      faqs = faqsText.trim() === '' ? [] : JSON.parse(faqsText);
      if (!Array.isArray(faqs)) throw new Error('not an array');
    } catch {
      toast.error('FAQs must be valid JSON');
      setSubmitting(false);
      return;
    }

    const payload: PackageInput = {
      ...values,
      pricing,
      faqs,
      duration_days: Number(values.duration_days) || 0,
      duration_nights: Number(values.duration_nights) || 0,
      starting_price: values.starting_price === null ? null : Number(values.starting_price),
    };

    try {
      const url = isEdit ? `/api/admin/packages/${initialValues!.id}` : '/api/admin/packages';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        const message = j?.error ?? 'Failed to save package';
        toast.error(message, {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success(isEdit ? 'Package updated' : 'Package created');
      router.push('/admin/packages');
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basics */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Basics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} aria-invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              aria-invalid={!!errors.slug}
              onBlur={() => setSlugTouched(true)}
              onChange={(e) => {
                setSlugTouched(true);
                setValue('slug', e.target.value, { shouldValidate: true });
              }}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" {...register('subtitle')} />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={watch('category_id') ?? '__none__'}
              onValueChange={(v) => setValue('category_id', v === '__none__' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— No category —</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Destination</Label>
            <Select
              value={watch('destination_id') ?? '__none__'}
              onValueChange={(v) => setValue('destination_id', v === '__none__' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— No destination —</SelectItem>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="destinations">Destinations (comma-separated)</Label>
            <Input
              id="destinations"
              placeholder="Varanasi, Rishikesh, Haridwar"
              defaultValue={(watch('destinations') ?? []).join(', ')}
              onChange={(e) =>
                setValue(
                  'destinations',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration_days">Duration (days)</Label>
            <Input
              id="duration_days"
              type="number"
              min={0}
              {...register('duration_days')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration_nights">Duration (nights)</Label>
            <Input
              id="duration_nights"
              type="number"
              min={0}
              {...register('duration_nights')}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Content</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="overview">Overview</Label>
            <Textarea id="overview" rows={6} {...register('overview')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="highlights">Highlights (one per line)</Label>
            <Textarea
              id="highlights"
              rows={4}
              defaultValue={(watch('highlights') ?? []).join('\n')}
              onChange={(e) =>
                setValue(
                  'highlights',
                  e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="inclusions">Inclusions (one per line)</Label>
              <Textarea
                id="inclusions"
                rows={6}
                defaultValue={(watch('inclusions') ?? []).join('\n')}
                onChange={(e) =>
                  setValue(
                    'inclusions',
                    e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exclusions">Exclusions (one per line)</Label>
              <Textarea
                id="exclusions"
                rows={6}
                defaultValue={(watch('exclusions') ?? []).join('\n')}
                onChange={(e) =>
                  setValue(
                    'exclusions',
                    e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Pricing</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="starting_price">Starting price (₹)</Label>
            <Input
              id="starting_price"
              type="number"
              min={0}
              {...register('starting_price')}
            />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="pricing">Pricing options (JSON)</Label>
          <Textarea
            id="pricing"
            rows={10}
            className="font-mono text-xs"
            placeholder={PRICING_PLACEHOLDER}
            value={pricingText}
            onChange={(e) => setPricingText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Edit the JSON above to define tiered pricing options.
          </p>
        </div>
      </section>

      {/* Media */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Media</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cover_image">Cover image URL</Label>
            <Input id="cover_image" type="url" {...register('cover_image')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="gallery">Gallery (one URL per line)</Label>
            <Textarea
              id="gallery"
              rows={4}
              defaultValue={galleryLines(watch('gallery'))}
              onChange={(e) =>
                setValue(
                  'gallery',
                  e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">FAQs</h3>
        <div className="space-y-1.5">
          <Label htmlFor="faqs">FAQs (JSON)</Label>
          <Textarea
            id="faqs"
            rows={8}
            className="font-mono text-xs"
            placeholder={FAQS_PLACEHOLDER}
            value={faqsText}
            onChange={(e) => setFaqsText(e.target.value)}
          />
        </div>
      </section>

      {/* SEO + Flags */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">SEO &amp; Status</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="seo_title">SEO title</Label>
            <Input id="seo_title" {...register('seo_title')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="canonical_path">Canonical path</Label>
            <Input id="canonical_path" placeholder="/packages/..." {...register('canonical_path')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="seo_description">SEO description</Label>
            <Textarea id="seo_description" rows={3} {...register('seo_description')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="og_image">OG image URL</Label>
            <Input id="og_image" type="url" {...register('og_image')} />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_published"
              checked={Boolean(watch('is_published'))}
              onCheckedChange={(v) => setValue('is_published', v)}
            />
            <Label htmlFor="is_published">Published</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="is_featured"
              checked={Boolean(watch('is_featured'))}
              onCheckedChange={(v) => setValue('is_featured', v)}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/packages')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isEdit ? 'Save changes' : 'Create package'}
        </Button>
      </div>
    </form>
  );
}

function galleryLines(gallery: string[] | undefined): string {
  return (gallery ?? []).join('\n');
}
