'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, GripVertical, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Settings2, Save, Loader as Loader2, ExternalLink, Image as ImageIcon, ImagePlus, Code, Copy, Check, X } from 'lucide-react';
import { SECTION_TYPE_META, SECTION_GROUPS } from '@/lib/sections/meta';
import { MediaPicker } from '@/components/admin/media-picker';
import { cn } from '@/lib/utils';
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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(
      `/api/admin/page-sections?entity_type=content_page&entity_id=${page.id}`,
    );
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
    const res = await fetch(`/api/admin/page-sections/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setSections((prev) => prev.filter((s) => s.id !== id));
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
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_enabled: !current } : s)),
      );
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

  const updateSectionConfig = async (id: string, config: Record<string, unknown>, label?: string) => {
    const body: Record<string, unknown> = { config };
    if (label !== undefined) body.label = label;
    const res = await fetch(`/api/admin/page-sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, config, ...(label !== undefined ? { label } : {}) } : s)),
      );
      toast.success('Section updated');
      setEditingSection(null);
    } else {
      toast.error('Failed to update');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    setDragIndex(idx);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
    setTimeout(() => { if (dragNodeRef.current) dragNodeRef.current.style.opacity = '0.4'; }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = '1';
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== dragOverIndex) setDragOverIndex(idx);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropIdx: number) => {
    e.preventDefault();
    const fromIdx = dragIndex;
    if (fromIdx === null || fromIdx === dropIdx) { handleDragEnd(); return; }

    const newSections = [...sections];
    const [moved] = newSections.splice(fromIdx, 1);
    newSections.splice(dropIdx, 0, moved);

    const reordered = newSections.map((s, i) => ({ ...s, display_order: i }));
    setSections(reordered);
    setDragIndex(null);
    setDragOverIndex(null);

    await Promise.all(
      reordered.map((s, i) =>
        fetch(`/api/admin/page-sections/${s.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: i }),
        }),
      ),
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/content-pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {page.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              /{page.slug} &mdash; {sections.length} section
              {sections.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${page.slug}?preview=true`} target="_blank">
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
            <p className="text-muted-foreground">
              No sections yet. Add your first section to start building.
            </p>
            <Button className="mt-4" onClick={() => setAddPanelOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        )}

        {sections.map((section, idx) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={cn(
              'group rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md',
              dragOverIndex === idx && dragIndex !== idx && 'ring-2 ring-primary ring-offset-1',
            )}
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {section.label ||
                      SECTION_TYPE_META[section.section_type as SectionType]
                        ?.label ||
                      section.section_type}
                  </span>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {section.section_type.replace(/_/g, ' ')}
                  </Badge>
                  {!section.is_enabled && (
                    <Badge variant="outline" className="text-[10px]">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === sections.length - 1}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    toggleEnabled(section.id, section.is_enabled)
                  }
                >
                  {section.is_enabled ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    setEditingSection(
                      editingSection === section.id ? null : section.id,
                    )
                  }
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => deleteSection(section.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {editingSection === section.id && (
              <SectionConfigEditor
                section={section}
                onSave={(config, label) =>
                  updateSectionConfig(section.id, config, label)
                }
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

/* ------------------------------------------------------------------ */
/*  Section Config Editor — image-aware with media picker               */
/* ------------------------------------------------------------------ */

const IMAGE_FIELDS = [
  'image',
  'images',
  'background_image',
  'background_image_mobile',
  'cover_image',
  'thumbnail',
  'hero_image',
  'og_image',
  'logo',
  'logo_url',
  'video_url',
  'video_url_mobile',
  'video_poster',
];

const TEXTAREA_FIELDS = [
  'html',
  'content',
  'text',
  'subheading',
  'description',
  'message_template',
  'address_label',
  'caption',
  'seo_description',
  'cta_text',
  'secondary_cta_text',
  'button_text',
  'cta_label',
];

const NUMBER_FIELDS = [
  'height',
  'columns',
  'limit',
  'overlay_opacity',
  'display_order',
  'zoom',
  'price',
  'starting_price',
  'max_width_px',
  'duration',
  'travelers',
  'rating',
  'packages',
  'years',
  'adults',
  'children',
  'budget',
  'min_budget',
  'max_budget',
  'seats',
  'luggage',
  'passengers',
  'rooms',
  'days',
  'nights',
];

const KNOWN_KEYS_BY_SECTION: Record<string, string[]> = {
  hero_banner: [
    'heading',
    'subheading',
    'background_image',
    'background_image_mobile',
    'background_video',
    'overlay_opacity',
    'cta_primary_text',
    'cta_primary_url',
    'cta_secondary_text',
    'cta_secondary_url',
    'height',
    'text_align',
    'text_color',
    'text_max_width',
  ],
  rich_text: ['content', 'html', 'max_width', 'background', 'text_align'],
  image_text_split: [
    'heading',
    'text',
    'image',
    'image_side',
    'cta_text',
    'cta_url',
    'background',
  ],
  image_gallery: ['images', 'heading', 'columns', 'layout'],
  image_banner: ['image', 'alt', 'caption', 'full_width', 'link'],
  video_section: [
    'video_url',
    'video_url_mobile',
    'video_poster',
    'heading',
    'subheading',
    'autoplay',
    'loop',
    'muted',
    'controls',
  ],
  timeline: ['heading', 'items'],
  package_grid: ['heading', 'source', 'category_id', 'limit', 'columns'],
  destination_grid: ['heading', 'region', 'limit', 'columns'],
  vehicle_grid: ['heading', 'source', 'category_id', 'limit', 'columns'],
  transfer_grid: ['heading', 'from_city', 'limit', 'columns'],
  blog_grid: ['heading', 'source', 'category', 'limit', 'columns'],
  testimonials: ['heading', 'source', 'limit', 'columns'],
  faq: ['heading', 'source', 'category_id', 'limit'],
  feature_cards: ['heading', 'cards', 'columns'],
  statistics: ['heading', 'stats', 'background'],
  pricing_cards: ['heading', 'pricing', 'columns'],
  enquiry_form: ['heading', 'form_key', 'layout', 'success_message'],
  cta_banner: [
    'heading',
    'subheading',
    'cta_text',
    'cta_url',
    'secondary_cta_text',
    'secondary_cta_url',
    'background',
    'include_whatsapp',
  ],
  whatsapp_cta: ['heading', 'message_template', 'button_text', 'background'],
  google_map: ['embed_url', 'height', 'address_label', 'zoom'],
  html_block: ['html'],
};

const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'];
const HEIGHT_OPTIONS = ['small', 'medium', 'large', 'full'];
const LAYOUT_OPTIONS = ['grid', 'list', 'carousel', 'masonry'];
const SOURCE_OPTIONS = ['all', 'featured', 'latest', 'manual', 'category', 'destination'];
const BACKGROUND_OPTIONS = ['default', 'light', 'dark', 'primary', 'accent', 'muted'];

function SectionConfigEditor({
  section,
  onSave,
  onCancel,
}: {
  section: PageSectionRow;
  onSave: (config: Record<string, unknown>, label: string) => void;
  onCancel: () => void;
}) {
  const [config, setConfig] = useState<Record<string, unknown>>(
    () => ({ ...section.config }),
  );
  const [label, setLabel] = useState(section.label || '');
  const [showRaw, setShowRaw] = useState(false);
  const [rawJson, setRawJson] = useState(
    JSON.stringify(section.config, null, 2),
  );
  const [pickerTarget, setPickerTarget] = useState<{
    key: string;
    isArray?: boolean;
  } | null>(null);
  const [jsonError, setJsonError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const knownKeys =
    KNOWN_KEYS_BY_SECTION[section.section_type] ||
    Object.keys(section.config);

  const allKeys = Array.from(
    new Set([...knownKeys, ...Object.keys(config)]),
  );

  const setValue = (key: string, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (showRaw) {
      try {
        const parsed = JSON.parse(rawJson);
        onSave(parsed, label);
      } catch {
        setJsonError('Invalid JSON');
      }
    } else {
      onSave(config, label);
    }
  };

  const handleImageSelect = (url: string) => {
    if (!pickerTarget) return;
    const { key, isArray } = pickerTarget;
    if (isArray) {
      const current = (config[key] as string[]) || [];
      setValue(key, [...current, url]);
    } else {
      setValue(key, url);
    }
    setPickerTarget(null);
  };

  const removeImage = (key: string, index: number) => {
    const current = (config[key] as string[]) || [];
    setValue(
      key,
      current.filter((_, i) => i !== index),
    );
  };

  const reorderImage = (key: string, index: number, direction: 'up' | 'down') => {
    const current = [...((config[key] as string[]) || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= current.length) return;
    [current[index], current[newIndex]] = [current[newIndex], current[index]];
    setValue(key, current);
  };

  const copyValue = async (key: string) => {
    const val = String(config[key] ?? '');
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="border-t border-border px-4 py-4 space-y-3">
      {/* Label */}
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Section Label
        </label>
        <input
          className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Hero Banner"
        />
      </div>

      {/* Toggle: Form / Raw JSON */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowRaw(false);
            setJsonError('');
          }}
          className={`text-xs px-2 py-1 rounded transition ${
            !showRaw
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Form Fields
        </button>
        <button
          type="button"
          onClick={() => {
            setShowRaw(true);
            setRawJson(JSON.stringify(config, null, 2));
          }}
          className={`text-xs px-2 py-1 rounded transition ${
            showRaw
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Code className="inline h-3 w-3 mr-1" />
          Raw JSON
        </button>
      </div>

      {/* Media Picker Dialog */}
      <MediaPicker
        open={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        onSelect={handleImageSelect}
      />

      {showRaw ? (
        <div className="grid gap-1.5">
          <textarea
            className="h-40 w-full rounded border border-input bg-background p-2 font-mono text-xs"
            value={rawJson}
            onChange={(e) => {
              setRawJson(e.target.value);
              setJsonError('');
            }}
          />
          {jsonError && (
            <p className="text-xs text-destructive">{jsonError}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allKeys.map((key) => {
            const value = config[key];
            const isImage = IMAGE_FIELDS.includes(key);
            const isArrayImage = key === 'images';
            const isNumber = NUMBER_FIELDS.includes(key);
            const isTextarea = TEXTAREA_FIELDS.includes(key);
            const isBoolean =
              typeof value === 'boolean' ||
              (!value &&
                !isImage &&
                !isNumber &&
                !isTextarea &&
                key !== 'text_align' &&
                key !== 'height' &&
                key !== 'layout' &&
                key !== 'source' &&
                key !== 'background');

            if (isArrayImage) {
              const images = (value as string[]) || [];
              return (
                <div
                  key={key}
                  className="grid gap-1.5 sm:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPickerTarget({ key, isArray: true })
                        }
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ImagePlus className="h-3 w-3" /> Add Image
                      </button>
                    </div>
                  </div>
                  {images.length === 0 ? (
                    <div className="rounded border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      No images added.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded border border-border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() =>
                                copyValue(img)
                              }
                              className="rounded bg-white/90 p-1 text-foreground hover:bg-white"
                              title="Copy URL"
                            >
                              {copiedField === img ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                reorderImage(key, idx, 'up')
                              }
                              className="rounded bg-white/90 p-1 text-foreground hover:bg-white"
                              title="Move up"
                              disabled={idx === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                reorderImage(key, idx, 'down')
                              }
                              className="rounded bg-white/90 p-1 text-foreground hover:bg-white"
                              title="Move down"
                              disabled={
                                idx === images.length - 1
                              }
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(key, idx)}
                              className="rounded bg-white/90 p-1 text-destructive hover:bg-destructive hover:text-white"
                              title="Remove"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (isImage && !isArrayImage) {
              const imgUrl = (value as string) || '';
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {imgUrl ? (
                    <div className="relative overflow-hidden rounded border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt=""
                        className="h-32 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copyValue(imgUrl)}
                          className="rounded bg-background/90 p-1.5 text-foreground hover:bg-background shadow-sm"
                          title="Copy URL"
                        >
                          {copiedField === imgUrl ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPickerTarget({ key })
                          }
                          className="rounded bg-background/90 p-1.5 text-foreground hover:bg-background shadow-sm"
                          title="Change image"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue(key, '')}
                          className="rounded bg-background/90 p-1.5 text-destructive hover:bg-destructive hover:text-white shadow-sm"
                          title="Remove"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ key })}
                      className="flex h-24 w-full items-center justify-center gap-2 rounded border border-dashed border-border bg-muted/30 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <ImageIcon className="h-5 w-5" />
                      Choose Image
                    </button>
                  )}
                  <input
                    className="h-8 w-full rounded border border-input bg-background px-2 text-xs font-mono"
                    value={imgUrl}
                    onChange={(e) => setValue(key, e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              );
            }

            if (key === 'text_align') {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="flex gap-1">
                    {TEXT_ALIGN_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(key, opt)}
                        className={`rounded px-2.5 py-1 text-xs capitalize transition border ${
                          value === opt
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (key === 'height') {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {HEIGHT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(key, opt)}
                        className={`rounded px-2.5 py-1 text-xs capitalize transition border ${
                          value === opt
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (key === 'layout') {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {LAYOUT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(key, opt)}
                        className={`rounded px-2.5 py-1 text-xs capitalize transition border ${
                          value === opt
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (key === 'source') {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {SOURCE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(key, opt)}
                        className={`rounded px-2.5 py-1 text-xs capitalize transition border ${
                          value === opt
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (key === 'background') {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {BACKGROUND_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(key, opt)}
                        className={`rounded px-2.5 py-1 text-xs capitalize transition border ${
                          value === opt
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (isBoolean) {
              return (
                <div key={key} className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={Boolean(value)}
                      onChange={(e) =>
                        setValue(key, e.target.checked)
                      }
                    />
                    <span className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </label>
                </div>
              );
            }

            if (isNumber) {
              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
                    value={
                      value === undefined || value === null
                        ? ''
                        : String(value)
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      setValue(
                        key,
                        v === '' ? null : Number(v),
                      );
                    }}
                  />
                </div>
              );
            }

            if (isTextarea) {
              return (
                <div key={key} className="grid gap-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <Textarea
                    rows={4}
                    className="text-sm"
                    value={
                      value === undefined || value === null
                        ? ''
                        : String(value)
                    }
                    onChange={(e) =>
                      setValue(key, e.target.value)
                    }
                  />
                </div>
              );
            }

            return (
              <div key={key} className="grid gap-1.5">
                <label className="text-xs font-medium text-muted-foreground capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <Input
                  className="h-8 text-sm"
                  value={
                    value === undefined || value === null
                      ? ''
                      : String(value)
                  }
                  onChange={(e) => setValue(key, e.target.value)}
                  placeholder={key === 'url' ? 'https://...' : ''}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="mr-1.5 h-3.5 w-3.5" /> Save Config
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Section Panel                                                  */
/* ------------------------------------------------------------------ */

function AddSectionPanel({
  onAdd,
  onClose,
  saving,
}: {
  onAdd: (t: SectionType) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const grouped = SECTION_GROUPS.reduce<
    Record<string, { type: SectionType; label: string }[]>
  >((acc, group) => {
    acc[group] = Object.entries(SECTION_TYPE_META)
      .filter(([, m]) => m.group === group)
      .map(([type, m]) => ({ type: type as SectionType, label: m.label }));
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-brand">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Add Section
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <div className="space-y-4">
        {SECTION_GROUPS.map((group) => (
          <div key={group}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
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
