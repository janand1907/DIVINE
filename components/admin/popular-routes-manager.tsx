'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { PopularRouteCategoryWithRoutes, PopularRouteRow } from '@/types/database';

interface PopularRoutesManagerProps {
  initialCategories: PopularRouteCategoryWithRoutes[];
}

export function PopularRoutesManager({ initialCategories }: PopularRoutesManagerProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<PopularRouteCategoryWithRoutes[]>(initialCategories);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });
  const [addingCat, setAddingCat] = useState(false);
  const [editCatForm, setEditCatForm] = useState<{ name: string; slug: string; description: string } | null>(null);
  const [newRoute, setNewRoute] = useState<{ [catId: string]: { label: string; url: string } }>({});
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [editRouteForm, setEditRouteForm] = useState<{ label: string; url: string } | null>(null);

  async function createCategory() {
    if (!newCat.name) return;
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch('/api/admin/popular-route-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCat, slug }),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const created = await res.json();
    setCategories((prev) => [...prev, { ...created, popular_routes: [] }]);
    setNewCat({ name: '', slug: '', description: '' });
    setAddingCat(false);
    toast({ title: 'Category created' });
  }

  async function updateCategory(id: string) {
    if (!editCatForm) return;
    const res = await fetch(`/api/admin/popular-route-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCatForm),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const updated = await res.json();
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...updated } : c));
    setEditingCat(null);
    toast({ title: 'Category updated' });
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category and all its routes?')) return;
    const res = await fetch(`/api/admin/popular-route-categories/${id}`, { method: 'DELETE' });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Category deleted' });
  }

  async function toggleVisibility(cat: PopularRouteCategoryWithRoutes) {
    const res = await fetch(`/api/admin/popular-route-categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cat, is_visible: !cat.is_visible }),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, is_visible: !c.is_visible } : c));
  }

  async function createRoute(catId: string) {
    const r = newRoute[catId];
    if (!r?.label || !r?.url) return;
    const res = await fetch('/api/admin/popular-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: catId, ...r }),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const created: PopularRouteRow = await res.json();
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, popular_routes: [...c.popular_routes, created] } : c));
    setNewRoute((prev) => ({ ...prev, [catId]: { label: '', url: '' } }));
    toast({ title: 'Route added' });
  }

  async function updateRoute(catId: string, routeId: string) {
    if (!editRouteForm) return;
    const res = await fetch(`/api/admin/popular-routes/${routeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editRouteForm),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const updated: PopularRouteRow = await res.json();
    setCategories((prev) => prev.map((c) => c.id === catId
      ? { ...c, popular_routes: c.popular_routes.map((r) => r.id === routeId ? updated : r) }
      : c
    ));
    setEditingRoute(null);
    toast({ title: 'Route updated' });
  }

  async function deleteRoute(catId: string, routeId: string) {
    const res = await fetch(`/api/admin/popular-routes/${routeId}`, { method: 'DELETE' });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    setCategories((prev) => prev.map((c) => c.id === catId
      ? { ...c, popular_routes: c.popular_routes.filter((r) => r.id !== routeId) }
      : c
    ));
    toast({ title: 'Route deleted' });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        <Button size="sm" onClick={() => setAddingCat(true)} disabled={addingCat}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Category
        </Button>
      </div>

      {/* New category form */}
      {addingCat && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">New Category</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label className="text-xs">Name *</Label>
              <Input
                value={newCat.name}
                onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value, slug: p.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))}
                placeholder="Chennai Routes"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Slug *</Label>
              <Input value={newCat.slug} onChange={(e) => setNewCat((p) => ({ ...p, slug: e.target.value }))} placeholder="chennai-routes" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={createCategory}>Create</Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingCat(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Categories list */}
      {categories.map((cat) => (
        <div key={cat.id} className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Category header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
            <button
              type="button"
              onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              {expandedCat === cat.id
                ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                : <ChevronRight className="h-4 w-4 text-muted-foreground" />
              }
              <span className="font-semibold text-sm text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-1">({cat.popular_routes.length} routes)</span>
              {!cat.is_visible && <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">Hidden</span>}
            </button>
            <div className="flex items-center gap-1">
              <button type="button" title={cat.is_visible ? 'Hide' : 'Show'} onClick={() => toggleVisibility(cat)} className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                {cat.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => { setEditingCat(cat.id); setEditCatForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' }); }}
                className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => deleteCategory(cat.id)} className="rounded p-1.5 text-destructive/60 transition hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Edit category form */}
          {editingCat === cat.id && editCatForm && (
            <div className="border-t border-border px-4 py-3 bg-primary/5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Label className="text-xs">Name</Label>
                  <Input value={editCatForm.name} onChange={(e) => setEditCatForm((p) => p && ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Slug</Label>
                  <Input value={editCatForm.slug} onChange={(e) => setEditCatForm((p) => p && ({ ...p, slug: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateCategory(cat.id)}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingCat(null)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Routes */}
          {expandedCat === cat.id && (
            <div className="border-t border-border divide-y divide-border">
              {cat.popular_routes.sort((a, b) => a.display_order - b.display_order).map((route) => (
                <div key={route.id} className="flex items-center gap-3 px-4 py-2.5">
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  {editingRoute === route.id && editRouteForm ? (
                    <div className="flex flex-1 gap-2 flex-wrap">
                      <Input className="h-8 flex-1 min-w-[140px] text-xs" value={editRouteForm.label} onChange={(e) => setEditRouteForm((p) => p && ({ ...p, label: e.target.value }))} placeholder="Label" />
                      <Input className="h-8 flex-1 min-w-[140px] text-xs" value={editRouteForm.url} onChange={(e) => setEditRouteForm((p) => p && ({ ...p, url: e.target.value }))} placeholder="URL" />
                      <Button size="sm" className="h-8" onClick={() => updateRoute(cat.id, route.id)}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditingRoute(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm text-foreground truncate">{route.label}</span>
                        <span className="block text-[11px] text-muted-foreground truncate">{route.url}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => { setEditingRoute(route.id); setEditRouteForm({ label: route.label, url: route.url }); }} className="rounded p-1 text-muted-foreground hover:text-foreground">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => deleteRoute(cat.id, route.id)} className="rounded p-1 text-destructive/60 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add route */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20">
                <Input
                  className="h-8 flex-1 text-xs"
                  placeholder="Route label (e.g. Chennai → Airport)"
                  value={newRoute[cat.id]?.label ?? ''}
                  onChange={(e) => setNewRoute((p) => ({ ...p, [cat.id]: { ...p[cat.id], label: e.target.value } }))}
                />
                <Input
                  className="h-8 flex-1 text-xs"
                  placeholder="URL (e.g. /airport-transfers/chennai-airport)"
                  value={newRoute[cat.id]?.url ?? ''}
                  onChange={(e) => setNewRoute((p) => ({ ...p, [cat.id]: { ...p[cat.id], url: e.target.value } }))}
                />
                <Button size="sm" className="h-8 shrink-0" onClick={() => createRoute(cat.id)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {categories.length === 0 && !addingCat && (
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No route categories yet.</p>
          <Button size="sm" className="mt-3" onClick={() => setAddingCat(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Category
          </Button>
        </div>
      )}
    </div>
  );
}
