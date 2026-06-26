'use client';

import { useState } from 'react';
import type { HomepageSection } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader as Loader2, Save, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface HomepageBuilderClientProps {
  sections: HomepageSection[];
}

const SECTION_DEFAULTS: Record<string, { title: string; fields: string[] }> = {
  hero: { title: 'Hero Banner', fields: ['title', 'subtitle', 'cta_label'] },
  trust_bar: { title: 'Trust Bar', fields: ['travelers', 'rating', 'packages', 'years'] },
  divine_tours: { title: 'Divine Tours', fields: ['heading', 'subheading'] },
  domestic_tours: { title: 'Domestic Tours', fields: ['heading', 'subheading'] },
  international_tours: { title: 'International Tours', fields: ['heading', 'subheading'] },
  featured_packages: { title: 'Featured Packages', fields: ['heading', 'limit'] },
  why_choose_us: { title: 'Why Choose Us', fields: ['heading'] },
  testimonials: { title: 'Testimonials', fields: ['heading'] },
  blog_section: { title: 'Blog Section', fields: ['heading', 'limit'] },
  contact_cta: { title: 'Contact CTA', fields: ['heading'] },
};

async function patchSection(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/admin/homepage-sections/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => null);
    throw new Error(j?.error ?? 'Request failed');
  }
  return res.json();
}

export function HomepageBuilderClient({ sections }: HomepageBuilderClientProps) {
  const [items, setItems] = useState<HomepageSection[]>(sections);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(sections[0]?.id ?? null);

  const updateConfig = (id: string, key: string, value: unknown) => {
    setItems((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s,
      ),
    );
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_enabled: enabled } : s)));
    try {
      await patchSection(id, { is_enabled: enabled });
    } catch {
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_enabled: !enabled } : s)));
      toast.error('Failed to update visibility.');
    }
  };

  const move = async (id: string, direction: 'up' | 'down') => {
    let updates: { id: string; display_order: number }[] = [];
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.display_order - b.display_order);
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const currentOrder = sorted[idx].display_order;
      sorted[idx] = { ...sorted[idx], display_order: sorted[swapIdx].display_order };
      sorted[swapIdx] = { ...sorted[swapIdx], display_order: currentOrder };
      updates = [
        { id: sorted[idx].id, display_order: sorted[idx].display_order },
        { id: sorted[swapIdx].id, display_order: sorted[swapIdx].display_order },
      ];
      return [...sorted];
    });
    if (updates.length > 0) {
      try {
        await Promise.all(
          updates.map(({ id: uid, display_order }) =>
            patchSection(uid, { display_order }),
          ),
        );
      } catch {
        toast.error('Failed to save order. Please refresh.');
      }
    }
  };

  const saveSection = async (section: HomepageSection) => {
    setSaving(section.id);
    try {
      await patchSection(section.id, {
        is_enabled: section.is_enabled,
        display_order: section.display_order,
        config: section.config,
      });
      toast.success(`Saved "${SECTION_DEFAULTS[section.section_key]?.title ?? section.section_key}"`);
    } catch (err) {
      toast.error('Failed to save section.');
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">Toggle, reorder, and configure homepage sections. Each section will reflect changes on the public home page after saving.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/" target="_blank"><Eye className="mr-1 h-3.5 w-3.5" /> Preview Home</Link>
        </Button>
      </Card>

      <div className="space-y-3">
        {sorted.map((section, idx) => {
          const meta = SECTION_DEFAULTS[section.section_key] ?? { title: section.section_key, fields: [] };
          const isOpen = expanded === section.id;
          return (
            <Card key={section.id} className={`overflow-hidden ${!section.is_enabled ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{meta.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{section.section_key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => move(section.id, 'up')}
                    disabled={idx === 0}
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(section.id, 'down')}
                    disabled={idx === sorted.length - 1}
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <Switch checked={section.is_enabled} onCheckedChange={(v) => toggleEnabled(section.id, v)} />
                  <Button variant="ghost" size="sm" onClick={() => setExpanded(isOpen ? null : section.id)}>
                    {isOpen ? 'Close' : 'Edit'}
                  </Button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {meta.fields.map((field) => {
                      const value = String((section.config as Record<string, unknown>)?.[field] ?? '');
                      const isLong = field === 'subtitle' || field === 'subheading' || field === 'heading';
                      return (
                        <div key={field} className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{field.replace('_', ' ')}</Label>
                          {isLong ? (
                            <Textarea
                              rows={2}
                              value={value}
                              onChange={(e) => updateConfig(section.id, field, e.target.value)}
                            />
                          ) : (
                            <Input
                              value={value}
                              onChange={(e) => updateConfig(section.id, field, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={() => saveSection(section)} disabled={saving === section.id}>
                      {saving === section.id ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1 h-3.5 w-3.5" />}
                      Save Section
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg border border-border bg-card shadow-brand ${className}`} {...props}>
      {children}
    </div>
  );
}
