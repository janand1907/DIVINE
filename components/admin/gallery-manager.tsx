'use client';

import { useState } from 'react';
import type { GalleryItemRow } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader as Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryManagerProps {
  initialItems: GalleryItemRow[];
}

const EMPTY: Partial<GalleryItemRow> = {
  title: '',
  image_url: '',
  category: '',
  tour_slug: '',
  is_published: true,
};

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItemRow[]>(initialItems);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryItemRow>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const openCreate = () => {
    setEditing({ ...EMPTY });
    setEditingId(null);
    setSheetOpen(true);
  };

  const openEdit = (item: GalleryItemRow) => {
    setEditing({ ...item });
    setEditingId(item.id);
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!editing.title?.trim() || !editing.image_url?.trim()) {
      toast.error('Title and image URL are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editing.title,
          image_url: editing.image_url,
          category: editing.category || null,
          tour_slug: editing.tour_slug || null,
          is_published: editing.is_published ?? true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? data : i)));
        toast.success('Gallery item updated');
      } else {
        setItems((prev) => [data, ...prev]);
        toast.success('Gallery item added');
      }
      setSheetOpen(false);
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (item: GalleryItemRow) => {
    const next = !item.is_published;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_published: next } : i)));
    const res = await fetch(`/api/admin/gallery/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: next }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_published: item.is_published } : i)));
      toast.error('Failed to update');
    }
  };

  const filtered = items.filter(
    (i) =>
      !filter ||
      i.title.toLowerCase().includes(filter.toLowerCase()) ||
      (i.category ?? '').toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Search gallery..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No gallery items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="aspect-square w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23eee"/%3E%3C/svg%3E'; }}
              />
              <div className="p-2">
                <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
                {item.category && (
                  <Badge variant="secondary" className="mt-1 text-xs">{item.category}</Badge>
                )}
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Switch
                  checked={item.is_published}
                  onCheckedChange={() => handleTogglePublish(item)}
                  className="scale-75"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded bg-white/20 p-1 text-white hover:bg-white/40"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="rounded bg-white/20 p-1 text-white hover:bg-red-500/80"
                  >
                    {deleting === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Image URL *</Label>
              <Input
                value={editing.image_url ?? ''}
                onChange={(e) => setEditing((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="https://..."
              />
              {editing.image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={editing.image_url} alt="Preview" className="mt-2 aspect-video w-full rounded object-cover" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={editing.title ?? ''}
                onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
                placeholder="Beach sunset at Goa"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={editing.category ?? ''}
                onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                placeholder="beaches, temples, wildlife..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tour Slug (optional link)</Label>
              <Input
                value={editing.tour_slug ?? ''}
                onChange={(e) => setEditing((p) => ({ ...p, tour_slug: e.target.value }))}
                placeholder="goa-beach-package"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={editing.is_published ?? true}
                onCheckedChange={(v) => setEditing((p) => ({ ...p, is_published: v }))}
              />
              <Label>Published</Label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Add Item'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
