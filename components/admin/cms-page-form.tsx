'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CmsPageRow } from '@/types/database';

interface CmsPageFormProps {
  initial?: CmsPageRow;
}

export function CmsPageForm({ initial }: CmsPageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    page_type: initial?.page_type ?? 'general',
    hero_heading: initial?.hero_heading ?? '',
    hero_subheading: initial?.hero_subheading ?? '',
    hero_image: initial?.hero_image ?? '',
    content: initial?.content ?? '',
    cta_text: initial?.cta_text ?? '',
    cta_url: initial?.cta_url ?? '',
    seo_title: initial?.seo_title ?? '',
    seo_description: initial?.seo_description ?? '',
    og_image: initial?.og_image ?? '',
    canonical_path: initial?.canonical_path ?? '',
    is_published: initial?.is_published ?? false,
    gallery: initial?.gallery ?? [],
    faqs: initial?.faqs ?? [],
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initial ? `/api/admin/cms-pages/${initial.id}` : '/api/admin/cms-pages';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast({ title: initial ? 'Page updated' : 'Page created' });
      router.push('/admin/cms-pages');
      router.refresh();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Page Details</h3>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Navagraha Tours" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="slug">Slug * <span className="text-xs text-muted-foreground">(URL path, no slashes)</span></Label>
                <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} required placeholder="navagraha-tours" />
                <p className="text-xs text-muted-foreground">Will be available at /{form.slug || 'your-slug'}</p>
              </div>
              <div className="grid gap-1.5">
                <Label>Page Type</Label>
                <Select value={form.page_type} onValueChange={(v) => set('page_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="seo">SEO Landing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Hero */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Hero Section</h3>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="hero_heading">Hero Heading</Label>
                <Input id="hero_heading" value={form.hero_heading} onChange={(e) => set('hero_heading', e.target.value)} placeholder="Main banner headline" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hero_subheading">Hero Subheading</Label>
                <Input id="hero_subheading" value={form.hero_subheading} onChange={(e) => set('hero_subheading', e.target.value)} placeholder="Supporting tagline" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hero_image">Hero Image URL</Label>
                <Input id="hero_image" value={form.hero_image} onChange={(e) => set('hero_image', e.target.value)} placeholder="https://..." type="url" />
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Page Content</h3>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="content">Content (supports Markdown)</Label>
                <Textarea id="content" value={form.content} onChange={(e) => set('content', e.target.value)} rows={12} placeholder="Write your page content here..." className="font-mono text-sm" />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Call to Action</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="cta_text">CTA Button Text</Label>
                <Input id="cta_text" value={form.cta_text} onChange={(e) => set('cta_text', e.target.value)} placeholder="Book Now" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cta_url">CTA Button URL</Label>
                <Input id="cta_url" value={form.cta_url} onChange={(e) => set('cta_url', e.target.value)} placeholder="/contact" />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Publish</h3>
            <div className="flex items-center gap-2">
              <Switch id="is_published" checked={form.is_published} onCheckedChange={(v) => set('is_published', v)} />
              <Label htmlFor="is_published">Published</Label>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">SEO</h3>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input id="seo_title" value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder="Page title for search engines" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea id="seo_description" value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} rows={3} placeholder="150–160 character description" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input id="og_image" value={form.og_image} onChange={(e) => set('og_image', e.target.value)} placeholder="https://..." type="url" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="canonical_path">Canonical Path</Label>
                <Input id="canonical_path" value={form.canonical_path} onChange={(e) => set('canonical_path', e.target.value)} placeholder="/page-slug" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : initial ? 'Update Page' : 'Create Page'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
