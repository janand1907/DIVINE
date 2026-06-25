import { createAdminClient } from '@/lib/supabase/server';
import { ThemeEditor } from '@/components/admin/theme-editor';
import type { ThemeSettingsRow, ThemePresetRow } from '@/types/database';
import { defaultTheme } from '@/lib/theme/theme';

export default async function AdminThemePage() {
  const supabase = createAdminClient();

  const [settingsRes, presetsRes] = await Promise.all([
    supabase.from('theme_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('theme_presets').select('*').order('created_at', { ascending: true }).returns<ThemePresetRow[]>(),
  ]);

  const settings: Partial<ThemeSettingsRow> = settingsRes.data ?? { primary_color: defaultTheme.primaryColor };
  const presets: ThemePresetRow[] = presetsRes.data ?? [];

  return <ThemeEditor settings={settings as ThemeSettingsRow} presets={presets} />;
}
