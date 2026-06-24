'use client';

import { useMemo, useState } from 'react';
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
import type { PackageCategoryRow } from '@/types/database';

interface CategoriesManagerProps {
  items: PackageCategoryRow[];
}

const EMPTY = {
  name: '',
  slug: '',
  description: '',
  parent_id: '__none__',
  display_order: 0,
  is_published: false,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function CategoriesManager({ items }: CategoriesManagerProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const parentOptions = useMemo(() => items, [items]);

  const reset = () => setForm(EMPTY);

  const submit = async (e: React.FormEvent, id: string | null) => {
    e.preventDefault();
    setSubmitting(true);
    const parent_id = form.parent_id === '__none__' ? null : form.parent_id;
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      parent_id,
      display_order: form.display_order,
      is_published: form.is_published,
    };
    const url = id ? `/api/admin/categories/${id}` : '/api/admin/categories';
    const method = id ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to save', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success(id ? 'Category updated' : 'Category created');
      reset();
      setShowCreate(false);
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  const editRow = (c: PackageCategoryRow) => {
    setEditingId(editingId === c.id ? null : c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      parent_id: c.parent_id ?? '__none__',
      display_order: c.display_order,
      is_published: c.is_published,
    });
  };

  const onDelete = async (c: PackageCategoryRow) => {
    if (!window.confirm(`Delete “${c.name}”?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Category deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
  };

  const parentName = (id: string | null) =>
    id ? items.find((i) => i.id === id)?.name ?? '—' : '—';

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
        <Label>Parent category</Label>
        <Select
          value={form.parent_id}
          onValueChange={(v) => setForm((f) => ({ ...f, parent_id: v }))}
        >
          <SelectTrigger><SelectValue placeholder="No parent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— No parent —</SelectItem>
            {parentOptions
              .filter((c) => c.id !== id)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
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
          <h2 className="font-heading text-xl font-semibold text-foreground">Package Categories</h2>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Button onClick={() => { setShowCreate((s) => !s); reset(); }}>
          {showCreate ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          New Category
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
              <TableHead className="hidden lg:table-cell">Parent</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <>
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{c.slug}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">{parentName(c.parent_id)}</TableCell>
                    <TableCell className="text-foreground">{c.display_order}</TableCell>
                    <TableCell>
                      {c.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => editRow(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(c)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editingId === c.id && (
                    <TableRow key={`${c.id}-edit`}>
                      <TableCell colSpan={6} className="bg-accent/40 p-6">
                        {renderForm(c.id, () => setEditingId(null))}
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
