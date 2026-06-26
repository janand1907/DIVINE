import type { SectionType } from '@/types/database';

export interface TemplateSection {
  section_type: SectionType;
  label: string;
  config: Record<string, unknown>;
}

export const TEMPLATES: Record<string, TemplateSection[]> = {
  blank: [],

  'tour-landing': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'large', text_align: 'left' } },
    { section_type: 'rich_text', label: 'Overview', config: { max_width: 'normal', background: 'default' } },
    { section_type: 'package_grid', label: 'Tour Packages', config: { source: 'featured', limit: 6, layout: 'grid' } },
    { section_type: 'image_gallery', label: 'Gallery', config: { layout: 'grid', columns: 3 } },
    { section_type: 'testimonials', label: 'Testimonials', config: { source: 'featured', limit: 3, layout: 'carousel' } },
    { section_type: 'faq', label: 'FAQs', config: { source: 'manual', faqs: [] } },
    { section_type: 'enquiry_form', label: 'Enquiry Form', config: { form_key: 'quick-quote', layout: 'card' } },
    { section_type: 'cta_banner', label: 'Call to Action', config: { background: 'dark', include_whatsapp: true } },
  ],

  'destination-page': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'large', text_align: 'center' } },
    { section_type: 'rich_text', label: 'About This Destination', config: { max_width: 'normal' } },
    { section_type: 'package_grid', label: 'Packages', config: { source: 'destination', limit: 6, layout: 'grid' } },
    { section_type: 'image_gallery', label: 'Gallery', config: { layout: 'grid', columns: 3 } },
    { section_type: 'faq', label: 'FAQs', config: { source: 'manual', faqs: [] } },
    { section_type: 'enquiry_form', label: 'Plan Your Trip', config: { form_key: 'package-inquiry', layout: 'card' } },
  ],

  'vehicle-page': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'medium', text_align: 'left' } },
    { section_type: 'image_text_split', label: 'Vehicle Details', config: { image_side: 'right' } },
    { section_type: 'pricing_cards', label: 'Pricing', config: { source: 'entity' } },
    { section_type: 'feature_cards', label: 'Features', config: { columns: 3 } },
    { section_type: 'image_gallery', label: 'Gallery', config: { layout: 'grid', columns: 3 } },
    { section_type: 'vehicle_grid', label: 'Related Vehicles', config: { source: 'category', limit: 3 } },
    { section_type: 'enquiry_form', label: 'Book Now', config: { form_key: 'vehicle-inquiry', layout: 'card' } },
  ],

  'transfer-route': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'medium', text_align: 'center' } },
    { section_type: 'rich_text', label: 'Route Information', config: { max_width: 'normal' } },
    { section_type: 'pricing_cards', label: 'Vehicle Options & Pricing', config: { source: 'entity' } },
    { section_type: 'feature_cards', label: 'Why Choose Us', config: { columns: 3 } },
    { section_type: 'faq', label: 'FAQs', config: { source: 'manual', faqs: [] } },
    { section_type: 'enquiry_form', label: 'Book Transfer', config: { form_key: 'transfer-inquiry', layout: 'card' } },
  ],

  'about-us': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'medium', text_align: 'center' } },
    { section_type: 'rich_text', label: 'Our Story', config: { max_width: 'narrow' } },
    { section_type: 'statistics', label: 'Our Numbers', config: { background: 'muted' } },
    { section_type: 'feature_cards', label: 'Why Choose Divine Travel', config: { columns: 3 } },
    { section_type: 'testimonials', label: 'What Our Clients Say', config: { source: 'featured', limit: 6, layout: 'grid' } },
    { section_type: 'cta_banner', label: 'Start Your Journey', config: { background: 'primary', include_whatsapp: true } },
  ],

  'contact-page': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'small', text_align: 'center' } },
    { section_type: 'enquiry_form', label: 'Contact Form', config: { form_key: 'contact', layout: 'card' } },
    { section_type: 'feature_cards', label: 'Ways to Reach Us', config: { columns: 3 } },
    { section_type: 'google_map', label: 'Our Location', config: { height: 400 } },
  ],

  general: [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'small', text_align: 'center' } },
    { section_type: 'rich_text', label: 'Content', config: { max_width: 'narrow' } },
    { section_type: 'cta_banner', label: 'Call to Action', config: { background: 'dark' } },
  ],

  corporate: [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'large', text_align: 'center' } },
    { section_type: 'rich_text', label: 'Corporate Travel Solutions', config: { max_width: 'normal' } },
    { section_type: 'feature_cards', label: 'Our Services', config: { columns: 3 } },
    { section_type: 'statistics', label: 'Track Record', config: { background: 'muted' } },
    { section_type: 'testimonials', label: 'Client Testimonials', config: { source: 'featured', limit: 3, layout: 'carousel' } },
    { section_type: 'enquiry_form', label: 'Get a Quote', config: { form_key: 'contact', layout: 'card' } },
  ],

  'group-tour': [
    { section_type: 'hero_banner', label: 'Hero', config: { height: 'large', text_align: 'center' } },
    { section_type: 'rich_text', label: 'Group Tour Services', config: { max_width: 'normal' } },
    { section_type: 'feature_cards', label: 'Why Group Tours', config: { columns: 3 } },
    { section_type: 'package_grid', label: 'Popular Group Packages', config: { source: 'featured', limit: 6, layout: 'grid' } },
    { section_type: 'vehicle_grid', label: 'Vehicles for Groups', config: { source: 'all', limit: 4 } },
    { section_type: 'faq', label: 'FAQs', config: { source: 'manual', faqs: [] } },
    { section_type: 'enquiry_form', label: 'Plan Your Group Tour', config: { form_key: 'quick-quote', layout: 'card' } },
  ],
};

export function getTemplateNames(): string[] {
  return Object.keys(TEMPLATES);
}
