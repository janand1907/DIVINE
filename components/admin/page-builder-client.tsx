'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, GripVertical, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Settings2, Save, Loader as Loader2, ExternalLink } from 'lucide-react';
import { SECTION_TYPE_META, SECTION_GROUPS } from '@/lib/sections/meta';
import type { ContentPageRow, PageSectionRow, SectionType } from '@/types/database';

interface Props {
  page: ContentPageRow;
  initialSections: PageSectionRow[];
}

export function PageBuilderClient({ page, initialSections }: Props) {
  const router = useRouter();
  const [sections, setSections] = useState<PageSectionRow[]>(initialSections);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/admin/page-sections?entity_type=content_page&entity_id=${page.id}`);
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
  }, [page.id]);

  const addSection = async (sectionType: SectionType) => {
    setSaving(true);
    const meta = SECTION_TYPE_META[sectionType];
    const res = await fetch('/api/admin/page-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_type: 'content_page',
        entity_id: page.id,
        section_type: sectionType,
        label: meta.label,
        config: {},
        display_order: sections.length,
        is_enabled: true,
      }),
    });
    if (res.ok) {
      await refresh();
      toast.success(`Added ${meta.label}`);
    } else {
      toast.error('Failed to add section');
    }
    setAddPanelOpen(false);
    setSaving(false);
  };

  const deleteSection = async (id: string) => {
    if (!window.confirm('Delete this section?')) return;
    const res = await fetch(`/api/admin/page-sections/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSections(prev => prev.filter(s => s.id !== id));
      toast.success('Section removed');
    } else {
      toast.error('Failed to remove');
    }
  };

  const toggleEnabled = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/page-sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: !current }),
    });
    if (res.ok) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, is_enabled: !current } : s));
    }
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;
    setSections(newSections);

    await Promise.all([
      fetch(`/api/admin/page-sections/${newSections[index].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: index }),
      }),
      fetch(`/api/admin/page-sections/${newSections[newIndex].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newIndex }),
      }),
    ]);
  };

  const updateSectionConfig = async (id: string, config: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/page-sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    });
    if (res.ok) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, config } : s));
      toast.success('Section updated');
      setEditingSection(null);
    } else {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/content-pages"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">{page.title}</h2>
            <p className="text-xs text-muted-foreground">/{page.slug} &mdash; {sections.length} section{sections.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${page.slug}`} target="_blank">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Preview
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/content-pages/new?edit=${page.id}`}>
              <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Page Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-2">
        {sections.length === 0 && !addPanelOpen && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground">No sections yet. Add your first section to start building.</p>
            <Button className="mt-4" onClick={() => setAddPanelOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        )}

        {sections.map((section, idx) => (
          <div key={section.id} className="group rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 px-4 py-3">
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {section.label || SECTION_TYPE_META[section.section_type as SectionType]?.label || section.section_type}
                  </span>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {section.section_type.replace(/_/g, ' ')}
                  </Badge>
                  {!section.is_enabled && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(idx, 'up')} disabled={idx === 0}>
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleEnabled(section.id, section.is_enabled)}>
                  {section.is_enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}>
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {editingSection === section.id && (
              <SectionConfigEditor
                section={section}
                onSave={(config) => updateSectionConfig(section.id, config)}
                onCancel={() => setEditingSection(null)}
              />
            )}
          </div>
        ))}

        {/* Add section button */}
        {sections.length > 0 && !addPanelOpen && (
          <button
            type="button"
            onClick={() => setAddPanelOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add Section
          </button>
        )}
      </div>

      {/* Add section panel */}
      {addPanelOpen && (
        <AddSectionPanel
          onAdd={addSection}
          onClose={() => setAddPanelOpen(false)}
          saving={saving}
        />
      )}
    </div>
  );
}

function AddSectionPanel({ onAdd, onClose, saving }: { onAdd: (t: SectionType) => void; onClose: () => void; saving: boolean }) {
  const grouped = SECTION_GROUPS.reduce<Record<string, { type: SectionType; label: string }[]>>((acc, group) => {
    acc[group] = Object.entries(SECTION_TYPE_META)
      .filter(([, m]) => m.group === group)
      .map(([type, m]) => ({ type: type as SectionType, label: m.label }));
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-brand">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Add Section</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      </div>
      <div className="space-y-4">
        {SECTION_GROUPS.map(group => (
          <div key={group}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {grouped[group]?.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  disabled={saving}
                  onClick={() => onAdd(type)}
                  className="rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm transition hover:border-primary hover:bg-primary/5 disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionConfigEditor({ section, onSave, onCancel }: {
  section: PageSectionRow;
  onSave: (config: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [json, setJson] = useState(JSON.stringify(section.config, null, 2));
  const [label, setLabel] = useState(section.label || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json);
      onSave(parsed);
    } catch {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="border-t border-border px-4 py-4 space-y-3">
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Section Label</label>
        <input
          className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Configuration (JSON)</label>
        <textarea
          className="h-40 w-full rounded border border-input bg-background p-2 font-mono text-xs"
          value={json}
          onChange={e => { setJson(e.target.value); setError(''); }}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="mr-1.5 h-3.5 w-3.5" /> Save Config
        </Button>
      </div>
    </div>
  );
}
