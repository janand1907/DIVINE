'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SeoPageRow } from '@/types/database';

interface SeoPagesManagerProps {
  items: SeoPageRow[];
}

interface RowDraft {
  path: string;
  seo_title: string;
  seo_description: string;
  canonical_path: string;
  og_image: string;
  robots_index: boolean;
}

const EMPTY_DRAFT: RowDraft = {
  path: '',
  seo_title: '',
  seo_description: '',
  canonical_path: '',
  og_image: '',
  robots_index: true,
};

export function SeoPagesManager({ items }: SeoPagesManagerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<RowDraft>(EMPTY_DRAFT);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, RowDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toDraft = (p: SeoPageRow): RowDraft => ({
    path: p.path,
    seo_title: p.seo_title ?? '',
    seo_description: p.seo_description ?? '',
    canonical_path: p.canonical_path ?? '',
    og_image: p.og_image ?? '',
    robots_index: p.robots_index,
  });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.path.trim()) {
      toast.error('Path is required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/seo-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to create', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setCreating(false);
        return;
      }
      toast.success('SEO page created');
      setDraft(EMPTY_DRAFT);
      router.refresh();
    } catch {
      toast.error('Network error');
    }
    setCreating(false);
  };

  const startEdit = (p: SeoPageRow) => {
    setEditingId(p.id);
    setEditDraft((d) => ({ ...d, [p.id]: toDraft(p) }));
  };

  const saveEdit = async (id: string) => {
    const payload = editDraft[id];
    if (!payload) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/seo-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to save', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSavingId(null);
        return;
      }
      toast.success('SEO page updated');
      setEditingId(null);
      setEditDraft((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      router.refresh();
    } catch {
      toast.error('Network error');
    }
    setSavingId(null);
  };

  const onDelete = async (p: SeoPageRow) => {
    if (!window.confirm(`Delete SEO page for “${p.path}”?`)) return;
    setDeletingId(p.id);
    try {
      const res = await fetch(`/api/admin/seo-pages/${p.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        setDeletingId(null);
        return;
      }
      toast.success('SEO page deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">SEO Pages</h2>
        <p className="text-sm text-muted-foreground">
          Manage per-path SEO metadata. Edit fields inline and click Save.
        </p>
      </div>

      {/* Create new row */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-semibold text-foreground">
          <Plus className="h-4 w-4" /> Add SEO page
        </h3>
        <form onSubmit={create} className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="new-path">Path *</Label>
            <Input
              id="new-path"
              placeholder="/packages/char-dham"
              value={draft.path}
              onChange={(e) => setDraft((d) => ({ ...d, path: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-title">SEO title</Label>
            <Input
              id="new-title"
              value={draft.seo_title}
              onChange={(e) => setDraft((d) => ({ ...d, seo_title: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-canonical">Canonical path</Label>
            <Input
              id="new-canonical"
              placeholder="/packages/char-dham"
              value={draft.canonical_path}
              onChange={(e) => setDraft((d) => ({ ...d, canonical_path: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="new-desc">SEO description</Label>
            <Input
              id="new-desc"
              value={draft.seo_description}
              onChange={(e) => setDraft((d) => ({ ...d, seo_description: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-og">OG image URL</Label>
            <Input
              id="new-og"
              type="url"
              value={draft.og_image}
              onChange={(e) => setDraft((d) => ({ ...d, og_image: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 md:col-span-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={draft.robots_index}
              onChange={(e) => setDraft((d) => ({ ...d, robots_index: e.target.checked }))}
            />
            <span className="text-sm">Allow search engines to index this path</span>
          </label>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add page
            </Button>
          </div>
        </form>
      </div>

      {/* Edit-in-place table */}
      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>SEO Title</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="hidden xl:table-cell">Canonical</TableHead>
              <TableHead>Index</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No SEO pages configured.
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => {
                const isEditing = editingId === p.id;
                const d = editDraft[p.id];
                return (
                  <TableRow key={p.id}>
                    {isEditing && d ? (
                      <>
                        <TableCell>
                          <Input
                            value={d.path}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, [p.id]: { ...d, path: e.target.value } }))
                            }
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={d.seo_title}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, [p.id]: { ...d, seo_title: e.target.value } }))
                            }
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Input
                            value={d.seo_description}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, [p.id]: { ...d, seo_description: e.target.value } }))
                            }
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Input
                            value={d.canonical_path}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, [p.id]: { ...d, canonical_path: e.target.value } }))
                            }
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-input"
                              checked={d.robots_index}
                              onChange={(e) =>
                                setEditDraft((s) => ({ ...s, [p.id]: { ...d, robots_index: e.target.checked } }))
                              }
                            />
                            <span className="text-xs text-muted-foreground">
                              {d.robots_index ? 'index' : 'noindex'}
                            </span>
                          </label>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Save"
                              onClick={() => saveEdit(p.id)}
                              disabled={savingId === p.id}
                            >
                              {savingId === p.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 text-success" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Cancel"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-mono text-xs text-foreground">{p.path}</TableCell>
                        <TableCell className="text-sm text-foreground">{p.seo_title ?? '—'}</TableCell>
                        <TableCell className="hidden max-w-xs truncate text-sm text-muted-foreground lg:table-cell">
                          {p.seo_description ?? '—'}
                        </TableCell>
                        <TableCell className="hidden font-mono text-xs text-muted-foreground xl:table-cell">
                          {p.canonical_path ?? '—'}
                        </TableCell>
                        <TableCell>
                          {p.robots_index ? (
                            <Badge>index</Badge>
                          ) : (
                            <Badge variant="outline">noindex</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Edit"
                              onClick={() => startEdit(p)}
                            >
                              <span className="text-sm text-primary">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Delete"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => onDelete(p)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
