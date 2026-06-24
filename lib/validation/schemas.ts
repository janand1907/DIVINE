import { z } from 'zod';

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'negotiation', 'confirmed', 'lost'] as const;
export const LEAD_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const LEAD_SOURCES = ['contact', 'package-inquiry', 'quick-quote', 'callback'] as const;

const mobileRegex = /^(\+?91)?[6-9]\d{9}$/;

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile: z.string().regex(mobileRegex, 'Enter a valid Indian mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  destination: z.string().max(120).optional().or(z.literal('')),
  travel_date: z.string().optional().or(z.literal('')).refine(
    (v) => !v || new Date(v) > new Date(),
    { message: 'Travel date must be in the future' },
  ),
  adults: z.coerce.number().int().min(1).max(50).optional(),
  children: z.coerce.number().int().min(0).max(50).optional(),
  budget: z.string().max(80).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  source: z.enum(LEAD_SOURCES).default('contact'),
  package_id: z.string().uuid().optional(),
  package_slug: z.string().max(200).optional(),
}).passthrough();

export const packageSchema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, hyphens, digits only'),
  title: z.string().min(2).max(200),
  subtitle: z.string().max(300).optional().or(z.literal('')),
  category_id: z.string().uuid().optional().nullable(),
  destination_id: z.string().uuid().optional().nullable(),
  destinations: z.array(z.string()).default([]),
  duration_days: z.coerce.number().int().min(0).max(365),
  duration_nights: z.coerce.number().int().min(0).max(365),
  highlights: z.array(z.string()).default([]),
  overview: z.string().default(''),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
  })).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  pricing: z.array(z.object({
    label: z.string(),
    price: z.string(),
    inclusions: z.array(z.string()),
  })).default([]),
  starting_price: z.coerce.number().min(0).optional().nullable(),
  gallery: z.array(z.string()).default([]),
  cover_image: z.string().url().optional().nullable().or(z.literal('')),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  seo_title: z.string().max(200).optional().nullable().or(z.literal('')),
  seo_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
  canonical_path: z.string().max(300).optional().nullable().or(z.literal('')),
});

export const blogSchema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(200),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().default(''),
  cover_image: z.string().url().optional().nullable().or(z.literal('')),
  category: z.string().max(80).optional().nullable().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  author: z.string().max(120).default('Divine Travel'),
  is_published: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  seo_title: z.string().max(200).optional().nullable().or(z.literal('')),
  seo_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
  canonical_path: z.string().max(300).optional().nullable().or(z.literal('')),
});

export const testimonialSchema = z.object({
  author_name: z.string().min(2).max(120),
  author_location: z.string().max(120).optional().nullable().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(5).max(2000),
  avatar_url: z.string().url().optional().nullable().or(z.literal('')),
  tour_taken: z.string().max(120).optional().nullable().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export const themeSettingsSchema = z.object({
  brand_name: z.string().min(1).max(120),
  logo_url: z.string().url().optional().nullable().or(z.literal('')),
  whatsapp_number: z.string().min(5).max(30),
  contact_phone: z.string().max(30).optional().nullable().or(z.literal('')),
  contact_email: z.string().email().optional().nullable().or(z.literal('')),
  address: z.string().max(500).optional().nullable().or(z.literal('')),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #RRGGBB format'),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #RRGGBB format'),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #RRGGBB format'),
  dark_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #RRGGBB format'),
  success_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use #RRGGBB format'),
});

export const seoPageSchema = z.object({
  path: z.string().min(1).max(300),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
  canonical_path: z.string().max(300).optional().nullable(),
  robots_index: z.boolean().default(true),
  json_ld: z.any().optional().nullable(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
