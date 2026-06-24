/**
 * Default brand theme. The runtime values come from the active `theme_presets`
 * row (fetched in root layout, passed to ThemeProvider); this object is the
 * fallback / initial seed preset persisted to the DB.
 *
 * Colors use 6-digit hex; ThemeProvider converts to "R G B" channel strings so
 * Tailwind's <alpha-value> modifier continues to work.
 */
export const defaultTheme: ThemeColors = {
  primaryColor: '#C48A2D',
  secondaryColor: '#8B1E3F',
  accentColor: '#F8F4EC',
  darkColor: '#1A1A1A',
  successColor: '#25D366',
};

export type ThemeColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkColor: string;
  successColor: string;
};

/** Convert "#RRGGBB" → "R G B" (channels only, no rgb() wrapper). */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return '196 138 45';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export const themePresetKeys = ['default', 'festival', 'temple', 'corporate', 'dark'] as const;
export type ThemePresetKey = (typeof themePresetKeys)[number];

export const themePresetLabels: Record<ThemePresetKey, string> = {
  default: 'Default',
  festival: 'Festival',
  temple: 'Temple',
  corporate: 'Corporate',
  dark: 'Dark',
};

export const themePresetsSeed: { key: ThemePresetKey; name: string; colors: ThemeColors }[] = [
  {
    key: 'default',
    name: 'Default',
    colors: {
      primaryColor: '#C48A2D',
      secondaryColor: '#8B1E3F',
      accentColor: '#F8F4EC',
      darkColor: '#1A1A1A',
      successColor: '#25D366',
    },
  },
  {
    key: 'festival',
    name: 'Festival',
    colors: {
      primaryColor: '#D4AF37',
      secondaryColor: '#B8312F',
      accentColor: '#FFF6E0',
      darkColor: '#2B1B0E',
      successColor: '#25D366',
    },
  },
  {
    key: 'temple',
    name: 'Temple',
    colors: {
      primaryColor: '#A0522D',
      secondaryColor: '#6B2C5F',
      accentColor: '#F3E9D8',
      darkColor: '#1F1A17',
      successColor: '#25D366',
    },
  },
  {
    key: 'corporate',
    name: 'Corporate',
    colors: {
      primaryColor: '#1E5A8A',
      secondaryColor: '#0F3D62',
      accentColor: '#EFF6FB',
      darkColor: '#111827',
      successColor: '#25D366',
    },
  },
  {
    key: 'dark',
    name: 'Dark',
    colors: {
      primaryColor: '#C48A2D',
      secondaryColor: '#8B1E3F',
      accentColor: '#232323',
      darkColor: '#2B1B0E',
      successColor: '#25D366',
    },
  },
];
