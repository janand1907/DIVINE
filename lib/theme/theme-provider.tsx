'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { hexToRgbChannels, defaultTheme, type ThemeColors } from './theme';

export interface Branding extends ThemeColors {
  brandName: string;
  logoUrl: string | null;
  whatsappNumber: string;
  contactPhone: string | null;
  contactEmail: string | null;
  address: string | null;
}

const defaultBranding: Branding = {
  ...defaultTheme,
  brandName: 'Divine Travel',
  logoUrl: null,
  whatsappNumber: '+919876543210',
  contactPhone: null,
  contactEmail: null,
  address: null,
};

const BrandingContext = createContext<Branding>(defaultBranding);

export function ThemeProvider({
  branding,
  children,
}: {
  branding: Branding | null;
  children: ReactNode;
}) {
  const value = useMemo<Branding>(
    () => ({ ...defaultBranding, ...(branding ?? {}) }),
    [branding],
  );

  const cssVars = `
    :root {
      --primary-rgb: ${hexToRgbChannels(value.primaryColor)};
      --secondary-rgb: ${hexToRgbChannels(value.secondaryColor)};
      --accent-rgb: ${hexToRgbChannels(value.accentColor)};
      --dark-rgb: ${hexToRgbChannels(value.darkColor)};
      --success-rgb: ${hexToRgbChannels(value.successColor)};
    }
  `;

  return (
    <BrandingContext.Provider value={value}>
      <style id="brand-vars" dangerouslySetInnerHTML={{ __html: cssVars }} />
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): Branding {
  return useContext(BrandingContext);
}
