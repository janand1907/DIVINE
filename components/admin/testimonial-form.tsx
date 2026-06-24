'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { testimonialSchema, type TestimonialInput } from '@/lib/validation/schemas';
import type { TestimonialRow } from '@/types/database';

interface TestimonialFormProps {
  initialValues?: TestimonialRow;
  onSaved?: (row: TestimonialRow) => void;
  onCancel?: () => void;
}

const EMPTY: TestimonialInput = {
  author_name: '',
  author_location: '',
  rating: 5,
  content: '',
  avatar_url: '',
  tour_taken: '',
  is_published: false,
};

/** Compact testimonial form used both standalone and inline. */
export function TestimonialForm({ initialValues, onSaved, onCancel }: TestimonialFormProps) {
  const isEdit = Boolean(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialValues ? (initialValues as unknown as TestimonialInput) : EMPTY,
  });

  const onSubmit = async (values: TestimonialInput) => {
    setSubmitting(true);
    const payload: TestimonialInput = { ...values, rating: Number(values.rating) };
    try {
      const url = isEdit
        ? `/api/admin/testimonials/${initialValues!.id}`
        : '/api/admin/testimonials';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        const { toast } = await import('sonner');
        toast.error(j?.error ?? 'Failed to save', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      reset();
      onSaved?.(j as TestimonialRow);
    } catch {
      const { toast } = await import('sonner');
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="author_name">Author name *</Label>
        <Input id="author_name" {...register('author_name')} aria-invalid={!!errors.author_name} />
        {errors.author_name && <p className="text-xs text-destructive">{errors.author_name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="author_location">Author location</Label>
        <Input id="author_location" {...register('author_location')} />
      </div>
      <div className="space-y-1.5">
        <Label>Rating</Label>
        <Select
          value={String(watch('rating'))}
          onValueChange={(v) => setValue('rating', Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {'★'.repeat(r)} ({r})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tour_taken">Tour taken</Label>
        <Input id="tour_taken" {...register('tour_taken')} placeholder="Char Dham Yatra" />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          rows={4}
          {...register('content')}
          aria-invalid={!!errors.content}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input id="avatar_url" type="url" {...register('avatar_url')} />
      </div>
      <label className="flex items-center gap-2 md:col-span-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          checked={Boolean(watch('is_published'))}
          onChange={(e) => setValue('is_published', e.target.checked)}
        />
        <span className="text-sm">Published</span>
      </label>
      <div className="flex items-center justify-end gap-2 md:col-span-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Save' : 'Add testimonial'}
        </Button>
      </div>
    </form>
  );
}
