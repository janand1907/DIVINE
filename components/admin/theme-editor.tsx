'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ThemeSettingsRow, ThemePresetRow } from '@/types/database';
import { themePresetsSeed } from '@/lib/theme/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Save, Check, Palette, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ThemeEditorProps {
  settings: ThemeSettingsRow;
  presets: ThemePresetRow[];
}

export function ThemeEditor({ settings, presets }: ThemeEditorProps) {
  const supabase = createClient();
  const [form, setForm] = useState({
    brand_name: settings.brand_name ?? 'Divine Travel',
    logo_url: settings.logo_url ?? '',
    whatsapp_number: settings.whatsapp_number ?? '+919876543210',
    contact_phone: settings.contact_phone ?? '',
    contact_email: settings.contact_email ?? '',
    address: settings.address ?? '',
    primary_color: settings.primary_color ?? '#C48A2D',
    secondary_color: settings.secondary_color ?? '#8B1E3F',
    accent_color: settings.accent_color ?? '#F8F4EC',
    dark_color: settings.dark_color ?? '#1A1A1A',
    success_color: settings.success_color ?? '#25D366',
  });
  const [saving, setSaving] = useState(false);
  const [savingPreset, setSavingPreset] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('theme_settings').update({
        brand_name: form.brand_name,
        logo_url: form.logo_url || null,
        whatsapp_number: form.whatsapp_number,
        contact_phone: form.contact_phone || null,
        contact_email: form.contact_email || null,
        address: form.address || null,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        accent_color: form.accent_color,
        dark_color: form.dark_color,
        success_color: form.success_color,
      }).eq('id', 1);
      if (error) throw error;

      // Also sync the active preset row
      await supabase.from('theme_presets').update({
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        accent_color: form.accent_color,
        dark_color: form.dark_color,
        success_color: form.success_color,
      }).eq('is_active', true);

      toast.success('Theme saved. Site will reflect changes on next visit.');
    } catch (err) {
      toast.error('Failed to save theme.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = async (preset: ThemePresetRow) => {
    setSavingPreset(preset.id);
    try {
      // Mark only this preset active
      await supabase.from('theme_presets').update({ is_active: false }).neq('id', preset.id);
      await supabase.from('theme_presets').update({ is_active: true }).eq('id', preset.id);

      // Copy preset colors into theme_settings
      const { error } = await supabase.from('theme_settings').update({
        primary_color: preset.primary_color,
        secondary_color: preset.secondary_color,
        accent_color: preset.accent_color,
        dark_color: preset.dark_color,
        success_color: preset.success_color,
      }).eq('id', 1);
      if (error) throw error;

      setForm({ ...form, ...{
        primary_color: preset.primary_color,
        secondary_color: preset.secondary_color,
        accent_color: preset.accent_color,
        dark_color: preset.dark_color,
        success_color: preset.success_color,
      }});
      toast.success(`Applied "${preset.name}" preset.`);
    } catch (err) {
      toast.error('Failed to apply preset.');
      console.error(err);
    } finally {
      setSavingPreset(null);
    }
  };

  const colorFields = [
    { key: 'primary_color', label: 'Primary', desc: 'Main brand color — buttons, accents' },
    { key: 'secondary_color', label: 'Secondary', desc: 'Highlights, badges' },
    { key: 'accent_color', label: 'Accent', desc: 'Backgrounds, subtle sections' },
    { key: 'dark_color', label: 'Dark', desc: 'Headers, footers, deep sections' },
    { key: 'success_color', label: 'Success / WhatsApp', desc: 'WhatsApp float, success states' },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Branding */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Branding</h2>
        <p className="mt-1 text-sm text-muted-foreground">Name, contact info, and logo. Changes apply site-wide.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input id="brand_name" value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" value={form.logo_url} placeholder="https://..." onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Contact Phone</Label>
            <Input id="phone" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
      </Card>

      {/* Color editor with live preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Colors
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Live preview below updates as you change colors.</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {colorFields.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="font-medium">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-md border border-border"
                  style={{ backgroundColor: form[key] }}
                />
                <Input
                  className="w-32 font-mono"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
                <input
                  type="color"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent p-1"
                  aria-label={`${label} color picker`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Live Preview</p>
          <div
            className="mt-2 rounded-lg border border-border p-6"
            style={{ backgroundColor: form.accent_color }}
          >
            <p className="text-xs uppercase tracking-wide" style={{ color: form.dark_color }}>Sample Section</p>
            <h3 className="mt-1 font-heading text-2xl font-semibold" style={{ color: form.dark_color }}>
              Sacred Journeys Await
            </h3>
            <p className="mt-1" style={{ color: form.dark_color }}>Premium pilgrimage tours from Chennai</p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md px-4 py-2 font-medium text-white" style={{ backgroundColor: form.primary_color }}>Primary Action</button>
              <button className="rounded-md px-4 py-2 font-medium text-white" style={{ backgroundColor: form.secondary_color }}>Secondary</button>
              <button className="rounded-md px-4 py-2 font-medium" style={{ backgroundColor: form.success_color, color: form.dark_color }}>WhatsApp</button>
            </div>
          </div>
        </div>
      </Card>

      {/* Presets */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" /> Theme Presets
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Switch instantly between saved color schemes. Future themes (dark, festival, temple, corporate) available here.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => {
            const isActive = preset.is_active;
            return (
              <div
                key={preset.id}
                className={`rounded-lg border-2 p-4 transition ${isActive ? 'border-primary' : 'border-border hover:border-primary/50'}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{preset.name}</h4>
                  {isActive && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Active</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  {[preset.primary_color, preset.secondary_color, preset.accent_color, preset.dark_color, preset.success_color].map((color, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <Button
                  variant={isActive ? 'outline' : 'default'}
                  size="sm"
                  className="mt-4 w-full"
                  disabled={isActive || savingPreset === preset.id}
                  onClick={() => applyPreset(preset)}
                >
                  {savingPreset === preset.id ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : isActive ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
                  {isActive ? 'Current Preset' : 'Apply'}
                </Button>
              </div>
            );
          })}
          {themePresetsSeed.length > presets.length && (
            <p className="text-xs text-muted-foreground">Seed presets not in DB? Visit the seed-missing helper.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
