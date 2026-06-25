'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { AirportRouteRow, AirportRouteVehicle } from '@/types/database';

interface AirportRouteFormProps {
  initial?: AirportRouteRow;
}

const EMPTY_VEHICLE: AirportRouteVehicle = { vehicle_type: '', seats: 4, price: 0 };

export function AirportRouteForm({ initial }: AirportRouteFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    from_city: initial?.from_city ?? '',
    to_city: initial?.to_city ?? '',
    distance_km: initial?.distance_km ?? '',
    duration_hours: initial?.duration_hours ?? '',
    vehicles: initial?.vehicles ?? [] as AirportRouteVehicle[],
    description: initial?.description ?? '',
    is_active: initial?.is_active ?? true,
    seo_title: initial?.seo_title ?? '',
    seo_description: initial?.seo_description ?? '',
    og_image: initial?.og_image ?? '',
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  function addVehicle() {
    set('vehicles', [...form.vehicles, { ...EMPTY_VEHICLE }]);
  }

  function updateVehicle(i: number, key: keyof AirportRouteVehicle, value: string | number) {
    const updated = form.vehicles.map((v, idx) => idx === i ? { ...v, [key]: value } : v);
    set('vehicles', updated);
  }

  function removeVehicle(i: number) {
    set('vehicles', form.vehicles.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initial ? `/api/admin/airport-routes/${initial.id}` : '/api/admin/airport-routes';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          distance_km: form.distance_km === '' ? null : Number(form.distance_km),
          duration_hours: form.duration_hours === '' ? null : Number(form.duration_hours),
          vehicles: form.vehicles.map((v) => ({ ...v, seats: Number(v.seats), price: Number(v.price) })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save');
      toast({ title: initial ? 'Route updated' : 'Route created' });
      router.push('/admin/airport-routes');
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
            <h3 className="mb-4 font-heading text-base font-semibold">Route Details</h3>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="from_city">From City *</Label>
                  <Input id="from_city" value={form.from_city} onChange={(e) => set('from_city', e.target.value)} required placeholder="Chennai" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="to_city">To City *</Label>
                  <Input id="to_city" value={form.to_city} onChange={(e) => set('to_city', e.target.value)} required placeholder="Tirupati" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} required placeholder="chennai-to-tirupati" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="distance_km">Distance (km)</Label>
                  <Input id="distance_km" type="number" min={0} value={form.distance_km} onChange={(e) => set('distance_km', e.target.value)} placeholder="132" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="duration_hours">Duration (hours)</Label>
                  <Input id="duration_hours" type="number" min={0} step="0.5" value={form.duration_hours} onChange={(e) => set('duration_hours', e.target.value)} placeholder="2.5" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="About this transfer route..." />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold">Vehicle Options</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVehicle}>
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </div>
            <div className="space-y-3">
              {form.vehicles.length === 0 && (
                <p className="text-sm text-muted-foreground">No vehicles added. Click "Add Vehicle" to add pricing options.</p>
              )}
              {form.vehicles.map((v, i) => (
                <div key={i} className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-4">
                  <div className="grid gap-1">
                    <Label className="text-xs">Vehicle Type</Label>
                    <Input value={v.vehicle_type} onChange={(e) => updateVehicle(i, 'vehicle_type', e.target.value)} placeholder="Sedan" />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Seats</Label>
                    <Input type="number" min={1} value={v.seats} onChange={(e) => updateVehicle(i, 'seats', Number(e.target.value))} />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Price (₹)</Label>
                    <Input type="number" min={0} value={v.price} onChange={(e) => updateVehicle(i, 'price', Number(e.target.value))} placeholder="3500" />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVehicle(i)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
            <h3 className="mb-4 font-heading text-base font-semibold">Settings</h3>
            <div className="flex items-center gap-2">
              <Switch id="is_active" checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} />
              <Label htmlFor="is_active">Active</Label>
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
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : initial ? 'Update Route' : 'Create Route'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
