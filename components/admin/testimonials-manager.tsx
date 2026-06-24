'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, X, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import type { TestimonialRow } from '@/types/database';

interface TestimonialsManagerProps {
  items: TestimonialRow[];
}

export function TestimonialsManager({ items }: TestimonialsManagerProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const onSaved = () => {
    setShowCreate(false);
    setEditingId(null);
    router.refresh();
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Testimonial deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Testimonials</h2>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Button onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          New Testimonial
        </Button>
      </div>

      {showCreate && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
          <h3 className="mb-4 font-heading text-base font-semibold text-foreground">New testimonial</h3>
          <TestimonialForm onSaved={onSaved} onCancel={() => setShowCreate(false)} />
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden md:table-cell">Tour</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No testimonials yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((t) => (
                <>
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-foreground">
                      {t.author_name}
                      {t.author_location ? (
                        <span className="block text-xs text-muted-foreground">{t.author_location}</span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < t.rating
                                ? 'h-4 w-4 fill-secondary text-secondary'
                                : 'h-4 w-4 text-muted-foreground/30'
                            }
                          />
                        ))}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {t.tour_taken ?? '—'}
                    </TableCell>
                    <TableCell>
                      {t.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    </TableCell>
                    <TableCell className="hidden max-w-md truncate text-sm text-muted-foreground lg:table-cell">
                      {t.content}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editingId === t.id && (
                    <TableRow key={`${t.id}-edit`}>
                      <TableCell colSpan={6} className="bg-accent/40 p-6">
                        <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">
                          Edit testimonial
                        </h4>
                        <TestimonialForm
                          initialValues={t}
                          onSaved={onSaved}
                          onCancel={() => setEditingId(null)}
                        />
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
