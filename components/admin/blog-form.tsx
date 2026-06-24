'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { blogSchema, type BlogInput } from '@/lib/validation/schemas';
import type { BlogRow } from '@/types/database';

interface BlogFormProps {
  initialValues?: BlogRow;
}

const EMPTY: BlogInput = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: '',
  tags: [],
  author: 'Divine Travel',
  is_published: false,
  published_at: null,
  seo_title: '',
  seo_description: '',
  og_image: '',
  canonical_path: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
}

export function BlogForm({ initialValues }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues ? (initialValues as unknown as BlogInput) : EMPTY,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues as unknown as BlogInput);
    }
  }, [initialValues, reset]);

  const title = watch('title');
  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(title ?? ''));
    }
  }, [title, slugTouched, setValue]);

  const onSubmit = async (values: BlogInput) => {
    setSubmitting(true);
    const payload: BlogInput = {
      ...values,
      published_at: values.published_at || (values.is_published ? new Date().toISOString() : null),
    };

    try {
      const url = isEdit ? `/api/admin/blogs/${initialValues!.id}` : '/api/admin/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Failed to save post', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success(isEdit ? 'Post updated' : 'Post created');
      router.push('/admin/blog');
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} aria-invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              aria-invalid={!!errors.slug}
              onBlur={() => setSlugTouched(true)}
              onChange={(e) => {
                setSlugTouched(true);
                setValue('slug', e.target.value, { shouldValidate: true });
              }}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="Spiritual Travel" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} {...register('excerpt')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="content">Content (Markdown) *</Label>
            <Textarea
              id="content"
              rows={16}
              className="font-mono text-sm"
              {...register('content')}
              aria-invalid={!!errors.content}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              defaultValue={(watch('tags') ?? []).join(', ')}
              onChange={(e) =>
                setValue(
                  'tags',
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register('author')} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Cover &amp; SEO</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cover_image">Cover image URL</Label>
            <Input id="cover_image" type="url" {...register('cover_image')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="canonical_path">Canonical path</Label>
            <Input id="canonical_path" placeholder="/blog/..." {...register('canonical_path')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seo_title">SEO title</Label>
            <Input id="seo_title" {...register('seo_title')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="og_image">OG image URL</Label>
            <Input id="og_image" type="url" {...register('og_image')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="seo_description">SEO description</Label>
            <Textarea id="seo_description" rows={3} {...register('seo_description')} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <div className="flex items-center gap-3">
          <Switch
            id="is_published"
            checked={Boolean(watch('is_published'))}
            onCheckedChange={(v) => setValue('is_published', v)}
          />
          <Label htmlFor="is_published">Publish immediately</Label>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isEdit ? 'Save changes' : 'Create post'}
        </Button>
      </div>
    </form>
  );
}
