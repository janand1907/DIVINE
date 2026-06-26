'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader as Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTemplateNames, TEMPLATES } from '@/lib/sections/templates';

const PAGE_TYPES = ['general', 'landing', 'module', 'category'] as const;

export default function ContentPageFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    page_type: 'general',
    module: '',
    entity_id: '',
    entity_type: '',
    is_published: false,
    display_order: 0,
    seo_title: '',
    seo_description: '',
    og_image: '',
    canonical_path: '',
    robots_index: true,
    schema_type: 'WebPage',
  });
  const [template, setTemplate] = useState('blank');

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/admin/content-pages/${editId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { toast.error(data.error); return; }
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          page_type: data.page_type || 'general',
          module: data.module || '',
          entity_id: data.entity_id || '',
          entity_type: data.entity_type || '',
          is_published: data.is_published ?? false,
          display_order: data.display_order ?? 0,
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          og_image: data.og_image || '',
          canonical_path: data.canonical_path || '',
          robots_index: data.robots_index ?? true,
          schema_type: data.schema_type || 'WebPage',
        });
      })
      .finally(() => setLoading(false));
  }, [editId]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: editId ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/admin/content-pages/${editId}` : '/api/admin/content-pages';
      const method = editId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }

      if (!editId && template !== 'blank') {
        const sections = TEMPLATES[template] || [];
        await Promise.all(
          sections.map((section, i) =>
            fetch('/api/admin/page-sections', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                entity_type: 'content_page',
                entity_id: data.id,
                section_type: section.section_type,
                label: section.label,
                config: section.config,
                display_order: i,
                is_enabled: true,
              }),
            }),
          ),
        );
      }

      toast.success(editId ? 'Page updated' : 'Page created');
      router.push(`/admin/content-pages/${data.id}/builder`);
      router.refresh();
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/content-pages"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {editId ? 'Edit Page Settings' : 'New Content Page'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input id="title" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="About Us" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input id="slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="about-us" />
          </div>
          <div className="grid gap-1.5">
            <Label>Page Type</Label>
            <Select value={form.page_type} onValueChange={v => setForm(f => ({ ...f, page_type: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!editId && (
          <div className="grid gap-1.5">
            <Label>Start from Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {getTemplateNames().map(t => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Template creates pre-configured sections you can customize in the builder.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="module">Module (optional)</Label>
            <Input id="module" value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))} placeholder="packages" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium text-foreground">SEO Settings</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input id="seo_title" value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="seo_description">Meta Description</Label>
              <Input id="seo_description" value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="canonical_path">Canonical Path</Label>
              <Input id="canonical_path" value={form.canonical_path} onChange={e => setForm(f => ({ ...f, canonical_path: e.target.value }))} placeholder="/about-us" />
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.robots_index} onChange={e => setForm(f => ({ ...f, robots_index: e.target.checked }))} className="rounded" />
                Allow search indexing
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded" />
            Publish this page (visible to public)
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/content-pages">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {editId ? 'Save Settings' : 'Create Page'}
          </Button>
        </div>
      </form>
    </div>
  );
}
