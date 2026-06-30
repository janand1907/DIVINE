import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── Spacing system (8px base) ── */
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '6':  '24px',
        '8':  '32px',
        '12': '48px',
        '16': '64px',
        '18': '72px',
        '24': '96px',
      },

      /* ── Border radius ── */
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
        /* legacy aliases kept for shadcn compatibility */
        DEFAULT: 'var(--radius-lg)',
      },

      /* ── Color tokens ── */
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          50:  'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          50:  'rgb(var(--color-secondary-50) / <alpha-value>)',
          100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
          200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
          300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
          400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
          700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
          800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
          900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        brand: {
          dark:               'rgb(var(--dark-rgb) / <alpha-value>)',
          darkForeground:     'rgb(var(--dark-foreground) / <alpha-value>)',
          whatsapp:           'rgb(var(--success-rgb) / <alpha-value>)',
          whatsappForeground: 'rgb(var(--success-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:    'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT:    'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT:    'rgb(var(--info) / <alpha-value>)',
          foreground: 'rgb(var(--info-foreground) / <alpha-value>)',
        },
        neutral: {
          50:  'rgb(var(--color-neutral-50) / <alpha-value>)',
          100: 'rgb(var(--color-neutral-100) / <alpha-value>)',
          200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
          300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
          400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
          500: 'rgb(var(--color-neutral-500) / <alpha-value>)',
          600: 'rgb(var(--color-neutral-600) / <alpha-value>)',
          700: 'rgb(var(--color-neutral-700) / <alpha-value>)',
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input:  'rgb(var(--input) / <alpha-value>)',
        ring:   'rgb(var(--ring) / <alpha-value>)',
        chart: {
          '1': 'rgb(var(--chart-1) / <alpha-value>)',
          '2': 'rgb(var(--chart-2) / <alpha-value>)',
          '3': 'rgb(var(--chart-3) / <alpha-value>)',
          '4': 'rgb(var(--chart-4) / <alpha-value>)',
          '5': 'rgb(var(--chart-5) / <alpha-value>)',
        },
      },

      /* ── Typography ── */
      fontFamily: {
        heading: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',   'Inter',   'system-ui', 'sans-serif'],
        sans:    ['var(--font-inter)',   'Inter',   'system-ui', 'sans-serif'],
      },
      fontSize: {
        display:   ['clamp(2.5rem, 6vw, 4rem)',        { lineHeight: '1.1', fontWeight: '700' }],
        h1:        ['clamp(2rem, 4vw, 3rem)',           { lineHeight: '1.2', fontWeight: '700' }],
        h2:        ['clamp(1.5rem, 3vw, 2.25rem)',      { lineHeight: '1.2', fontWeight: '600' }],
        h3:        ['clamp(1.25rem, 2vw, 1.75rem)',     { lineHeight: '1.2', fontWeight: '600' }],
        h4:        ['clamp(1.1rem, 1.5vw, 1.375rem)',   { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem',                         { lineHeight: '1.6' }],
        body:      ['1rem',                             { lineHeight: '1.6' }],
        sm:        ['0.875rem',                         { lineHeight: '1.5' }],
        xs:        ['0.75rem',                          { lineHeight: '1.4' }],
        caption:   ['0.75rem',                          { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      lineHeight: {
        display: '1.1',
        heading: '1.2',
        body:    '1.6',
        loose:   '1.8',
      },

      /* ── Shadows ── */
      boxShadow: {
        xs:      'var(--shadow-xs)',
        sm:      'var(--shadow-sm)',
        md:      'var(--shadow-md)',
        lg:      'var(--shadow-lg)',
        xl:      'var(--shadow-xl)',
        brand:   'var(--shadow-brand)',
        primary: 'var(--shadow-primary)',
      },

      /* ── Background images ── */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      /* ── Keyframes & animations ── */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.5s ease-out',
        'fade-up':         'fade-up 0.6s ease-out',
        'slide-in-right':  'slide-in-right 0.4s ease-out',
        'scale-in':        'scale-in 0.3s ease-out',
        shimmer:           'shimmer 2s infinite linear',
      },

      /* ── Transitions ── */
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast:   '150ms',
        base:   '250ms',
        slow:   '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
