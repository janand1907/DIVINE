'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, X, Trash2, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { HotelCityRow } from '@/types/database';

interface HotelCitiesManagerProps {
  items: HotelCityRow[];
}

const EMPTY = {
  name: '',
  slug: '',
  state: '',
  region: '',
  cover_image: '',
  description: '',
  display_order: 0,
  is_published: true,
  seo_title: '',
  seo_description: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function HotelCitiesManager({ items }: HotelCitiesManagerProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const reset = () => setForm(EMPTY);

  const submit = async (e: React.FormEvent, id: string | null) => {
    e.preventDefault();
    setSubmitting(true);
    const url = id ? `/api/admin/hotel-cities/${id}` : '/api/admin/hotel-cities';
    const method = id ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to save', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success(id ? 'Hotel city updated' : 'Hotel city created');
      reset();
      setShowCreate(false);
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  const editRow = (d: HotelCityRow) => {
    setEditingId(editingId === d.id ? null : d.id);
    setForm({
      name: d.name,
      slug: d.slug,
      state: d.state ?? '',
      region: d.region ?? '',
      cover_image: d.cover_image ?? '',
      description: d.description ?? '',
      display_order: d.display_order,
      is_published: d.is_published,
      seo_title: d.seo_title ?? '',
      seo_description: d.seo_description ?? '',
    });
  };

  const onDelete = async (d: HotelCityRow) => {
    if (!window.confirm(`Delete "${d.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/hotel-cities/${d.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Hotel city deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
  };

  const renderForm = (id: string | null, onCancel: () => void) => (
    <form onSubmit={(e) => submit(e, id)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor={`name-${id ?? 'new'}`}>Name *</Label>
        <Input
          id={`name-${id ?? 'new'}`}
          value={form.name}
          onChange={(e) => {
            const v = e.target.value;
            setForm((f) => ({ ...f, name: v, slug: id ? f.slug : slugify(v) }));
          }}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`slug-${id ?? 'new'}`}>Slug *</Label>
        <Input
          id={`slug-${id ?? 'new'}`}
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`state-${id ?? 'new'}`}>State</Label>
        <Input
          id={`state-${id ?? 'new'}`}
          value={form.state}
          onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          placeholder="e.g. Tamil Nadu"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`region-${id ?? 'new'}`}>Region</Label>
        <Input
          id={`region-${id ?? 'new'}`}
          value={form.region}
          onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
          placeholder="e.g. South India"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`order-${id ?? 'new'}`}>Display Order</Label>
        <Input
          id={`order-${id ?? 'new'}`}
          type="number"
          min={0}
          value={form.display_order}
          onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`cover-${id ?? 'new'}`}>Cover Image URL</Label>
        <Input
          id={`cover-${id ?? 'new'}`}
          type="url"
          value={form.cover_image}
          onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={`desc-${id ?? 'new'}`}>Description</Label>
        <Textarea
          id={`desc-${id ?? 'new'}`}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Brief description of the hotel city"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={`seo-title-${id ?? 'new'}`}>SEO Title</Label>
        <Input
          id={`seo-title-${id ?? 'new'}`}
          value={form.seo_title}
          onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
          placeholder="SEO title for search engines"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={`seo-desc-${id ?? 'new'}`}>SEO Description</Label>
        <Input
          id={`seo-desc-${id ?? 'new'}`}
          value={form.seo_description}
          onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
          placeholder="SEO description for search engines"
        />
      </div>
      <label className="flex items-center gap-3 md:col-span-2">
        <Switch
          checked={form.is_published}
          onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
        />
        <span className="text-sm">Published</span>
      </label>
      <div className="flex items-center justify-end gap-2 md:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onCancel();
            reset();
          }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {id ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Hotel Cities</h2>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Button
          onClick={() => {
            setShowCreate((s) => !s);
            reset();
          }}
        >
          {showCreate ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          New Hotel City
        </Button>
      </div>

      {showCreate && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
          {renderForm(null, () => setShowCreate(false))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">State</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-center">Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No hotel cities yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((d) => (
                <>
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-foreground">{d.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{d.state}</TableCell>
                    <TableCell className="text-foreground">{d.region}</TableCell>
                    <TableCell className="text-center text-foreground">{d.display_order}</TableCell>
                    <TableCell>
                      {d.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => editRow(d)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(d)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editingId === d.id && (
                    <TableRow key={`${d.id}-edit`}>
                      <TableCell colSpan={6} className="bg-accent/40 p-6">
                        {renderForm(d.id, () => setEditingId(null))}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
