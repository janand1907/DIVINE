'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { VehicleRow, VehicleCategoryRow } from '@/types/database';

interface VehicleFormProps {
  initial?: VehicleRow;
  categories: VehicleCategoryRow[];
}

export function VehicleForm({ initial, categories }: VehicleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    name: initial?.name ?? '',
    category_id: initial?.category_id ?? '',
    seats: initial?.seats ?? 4,
    luggage_capacity: initial?.luggage_capacity ?? 2,
    price_per_km: initial?.price_per_km ?? '',
    price_per_day: initial?.price_per_day ?? '',
    starting_price: initial?.starting_price ?? '',
    cover_image: initial?.cover_image ?? '',
    description: initial?.description ?? '',
    features: initial?.features ?? [] as string[],
    images: initial?.images ?? [] as string[],
    is_ac: initial?.is_ac ?? true,
    is_featured: initial?.is_featured ?? false,
    is_published: initial?.is_published ?? false,
    seo_title: initial?.seo_title ?? '',
    seo_description: initial?.seo_description ?? '',
    og_image: initial?.og_image ?? '',
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initial ? `/api/admin/vehicles/${initial.id}` : '/api/admin/vehicles';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price_per_km: form.price_per_km === '' ? null : Number(form.price_per_km),
          price_per_day: form.price_per_day === '' ? null : Number(form.price_per_day),
          starting_price: form.starting_price === '' ? null : Number(form.starting_price),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save');
      toast({ title: initial ? 'Vehicle updated' : 'Vehicle created' });
      router.push('/admin/vehicles');
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
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold">Vehicle Details</h3>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Toyota Innova Crysta" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} required placeholder="toyota-innova-crysta" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => set('category_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="seats">Seats</Label>
                  <Input id="seats" type="number" min={1} value={form.seats} onChange={(e) => set('seats', Number(e.target.value))} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="luggage">Luggage Capacity</Label>
                  <Input id="luggage" type="number" min={0} value={form.luggage_capacity} onChange={(e) => set('luggage_capacity', Number(e.target.value))} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="starting_price">Starting Price (₹)</Label>
                  <Input id="starting_price" type="number" min={0} value={form.starting_price} onChange={(e) => set('starting_price', e.target.value)} placeholder="3500" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="price_per_km">Price per KM (₹)</Label>
                  <Input id="price_per_km" type="number" min={0} step="0.01" value={form.price_per_km} onChange={(e) => set('price_per_km', e.target.value)} placeholder="12" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="price_per_day">Price per Day (₹)</Label>
                  <Input id="price_per_day" type="number" min={0} value={form.price_per_day} onChange={(e) => set('price_per_day', e.target.value)} placeholder="5000" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input id="cover_image" type="url" value={form.cover_image} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold">Features</h3>
            <div className="mb-3 flex gap-2">
              <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="e.g. AC, GPS, Music System" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (newFeature.trim()) { set('features', [...form.features, newFeature.trim()]); setNewFeature(''); } } }} />
              <Button type="button" variant="outline" onClick={() => { if (newFeature.trim()) { set('features', [...form.features, newFeature.trim()]); setNewFeature(''); } }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm">
                  {f}
                  <button type="button" onClick={() => set('features', form.features.filter((_, j) => j !== i))} className="ml-1 text-muted-foreground hover:text-destructive">×</button>
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="is_ac" checked={form.is_ac} onCheckedChange={(v) => set('is_ac', v)} />
                <Label htmlFor="is_ac">Air Conditioned</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(v) => set('is_featured', v)} />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_published" checked={form.is_published} onCheckedChange={(v) => set('is_published', v)} />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold">SEO</h3>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input id="seo_title" value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea id="seo_description" value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} rows={3} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input id="og_image" type="url" value={form.og_image} onChange={(e) => set('og_image', e.target.value)} />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Create Vehicle'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
