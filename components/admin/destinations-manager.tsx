'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, X, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DestinationRow } from '@/types/database';

interface DestinationsManagerProps {
  items: DestinationRow[];
}

type Region = 'divine' | 'domestic' | 'international';

const EMPTY = {
  name: '',
  slug: '',
  region: 'domestic' as Region,
  description: '',
  cover_image: '',
  display_order: 0,
  is_published: false,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function DestinationsManager({ items }: DestinationsManagerProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const reset = () => setForm(EMPTY);

  const submit = async (e: React.FormEvent, id: string | null) => {
    e.preventDefault();
    setSubmitting(true);
    const url = id ? `/api/admin/destinations/${id}` : '/api/admin/destinations';
    const method = id ? 'PUT' : 'POST';
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
      toast.success(id ? 'Destination updated' : 'Destination created');
      reset();
      setShowCreate(false);
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  const editRow = (d: DestinationRow) => {
    setEditingId(editingId === d.id ? null : d.id);
    setForm({
      name: d.name,
      slug: d.slug,
      region: d.region,
      description: d.description ?? '',
      cover_image: d.cover_image ?? '',
      display_order: d.display_order,
      is_published: d.is_published,
    });
  };

  const onDelete = async (d: DestinationRow) => {
    if (!window.confirm(`Delete “${d.name}”?`)) return;
    try {
      const res = await fetch(`/api/admin/destinations/${d.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Destination deleted');
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
        <Label>Region</Label>
        <Select value={form.region} onValueChange={(v) => setForm((f) => ({ ...f, region: v as Region }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="divine">Divine</SelectItem>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`order-${id ?? 'new'}`}>Display order</Label>
        <Input
          id={`order-${id ?? 'new'}`}
          type="number"
          min={0}
          value={form.display_order}
          onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={`desc-${id ?? 'new'}`}>Description</Label>
        <Textarea
          id={`desc-${id ?? 'new'}`}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={`cover-${id ?? 'new'}`}>Cover image URL</Label>
        <Input
          id={`cover-${id ?? 'new'}`}
          type="url"
          value={form.cover_image}
          onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
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
        <Button type="button" variant="outline" onClick={() => { onCancel(); reset(); }} disabled={submitting}>
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
          <h2 className="font-heading text-xl font-semibold text-foreground">Destinations</h2>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Button onClick={() => { setShowCreate((s) => !s); reset(); }}>
          {showCreate ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          New Destination
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
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No destinations yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((d) => (
                <>
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-foreground">{d.name}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{d.slug}</TableCell>
                    <TableCell className="capitalize text-foreground">{d.region}</TableCell>
                    <TableCell className="text-foreground">{d.display_order}</TableCell>
                    <TableCell>
                      {d.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => editRow(d)}>
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
