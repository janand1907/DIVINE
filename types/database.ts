/** Strongly-typed row shapes mirroring the Supabase schema. */

export interface ThemePresetRow {
  id: string;
  key: 'default' | 'festival' | 'temple' | 'corporate' | 'dark';
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_color: string;
  success_color: string;
  is_active: boolean;
  created_at: string;
}

export interface ThemeSettingsRow {
  id: 1;
  brand_name: string;
  logo_url: string | null;
  whatsapp_number: string;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_color: string;
  success_color: string;
  updated_at: string;
}

export interface SiteSettingsRow {
  id: 1;
  site_url: string | null;
  default_og_image: string | null;
  gtm_id: string | null;
  ga4_id: string | null;
  meta_pixel_id: string | null;
  google_search_console_verification: string | null;
  default_social_title: string | null;
  default_social_description: string | null;
  notifications_email: string | null;
  updated_at: string;
}

export interface DestinationRow {
  id: string;
  slug: string;
  name: string;
  region: 'divine' | 'domestic' | 'international';
  parent_id: string | null;
  description: string | null;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface PackageCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface PricingOption {
  label: string;
  price: string;
  inclusions: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PackageRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category_id: string | null;
  destination_id: string | null;
  destinations: string[];
  duration_days: number;
  duration_nights: number;
  highlights: string[];
  overview: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  pricing: PricingOption[];
  starting_price: number | null;
  gallery: string[];
  cover_image: string | null;
  faqs: FaqItem[];
  is_featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  reading_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'negotiation' | 'confirmed' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LeadSource =
  | 'contact'
  | 'package-inquiry'
  | 'quick-quote'
  | 'callback'
  | 'vehicle-inquiry'
  | 'transfer-inquiry'
  | 'hotel-assistance';

export interface LeadNote {
  at: string;
  by: string | null;
  note: string;
  status_change: LeadStatus | null;
}

export interface HotelLeadData {
  city?: string;
  check_in?: string;
  check_out?: string;
  rooms?: number;
  budget?: string;
}

export interface LeadRow {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  destination: string | null;
  travel_date: string | null;
  adults: number | null;
  children: number | null;
  budget: string | null;
  message: string | null;
  source: LeadSource;
  package_id: string | null;
  package_slug: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  followup_date: string | null;
  priority: LeadPriority;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  notes: LeadNote[];
  hotel_data: HotelLeadData | null;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  author_name: string;
  author_location: string | null;
  rating: number;
  content: string;
  avatar_url: string | null;
  tour_taken: string | null;
  is_published: boolean;
  created_at: string;
}

export interface FaqCategoryRow {
  id: string;
  name: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface FaqRow {
  id: string;
  category_id: string | null;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface GalleryItemRow {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  tour_slug: string | null;
  is_published: boolean;
  created_at: string;
}

export interface MediaAssetRow {
  id: string;
  filename: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  tags: string[];
  is_published: boolean;
  created_at: string;
}

export interface SeoPageRow {
  id: string;
  path: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  robots_index: boolean;
  json_ld: Record<string, unknown> | null;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key:
    | 'hero'
    | 'trust_bar'
    | 'divine_tours'
    | 'domestic_tours'
    | 'international_tours'
    | 'featured_packages'
    | 'why_choose_us'
    | 'testimonials'
    | 'blog_section'
    | 'contact_cta';
  is_enabled: boolean;
  display_order: number;
  config: Record<string, unknown>;
  updated_at: string;
}

export interface ActivityLogRow {
  id: string;
  user_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

// ── Navigation ────────────────────────────────────────────────
export interface NavMenuRow {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NavItemRow {
  id: string;
  menu_id: string;
  parent_id: string | null;
  title: string;
  url: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NavMenuWithItems extends NavMenuRow {
  nav_items: NavItemRow[];
}

// ── CMS Pages ─────────────────────────────────────────────────
export interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  page_type: 'tour' | 'vehicle' | 'transfer' | 'general' | 'seo';
  hero_heading: string | null;
  hero_subheading: string | null;
  hero_image: string | null;
  content: string;
  gallery: string[];
  faqs: FaqItem[];
  cta_text: string | null;
  cta_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ── Vehicle Rentals ───────────────────────────────────────────
export interface VehicleCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface VehicleRow {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  seats: number;
  luggage_capacity: number;
  price_per_km: number | null;
  price_per_day: number | null;
  starting_price: number | null;
  images: string[];
  cover_image: string | null;
  description: string;
  features: string[];
  is_ac: boolean;
  is_featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

// ── Airport Transfers ─────────────────────────────────────────
export interface AirportRouteVehicle {
  vehicle_type: string;
  seats: number;
  price: number;
}

export interface AirportRouteRow {
  id: string;
  slug: string;
  from_city: string;
  to_city: string;
  distance_km: number | null;
  duration_hours: number | null;
  vehicles: AirportRouteVehicle[];
  description: string | null;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      theme_presets: { Row: ThemePresetRow; Insert: Partial<ThemePresetRow>; Update: Partial<ThemePresetRow> };
      theme_settings: { Row: ThemeSettingsRow; Insert: Partial<ThemeSettingsRow>; Update: Partial<ThemeSettingsRow> };
      site_settings: { Row: SiteSettingsRow; Insert: Partial<SiteSettingsRow>; Update: Partial<SiteSettingsRow> };
      destinations: { Row: DestinationRow; Insert: Partial<DestinationRow>; Update: Partial<DestinationRow> };
      package_categories: { Row: PackageCategoryRow; Insert: Partial<PackageCategoryRow>; Update: Partial<PackageCategoryRow> };
      packages: { Row: PackageRow; Insert: Partial<PackageRow>; Update: Partial<PackageRow> };
      blogs: { Row: BlogRow; Insert: Partial<BlogRow>; Update: Partial<BlogRow> };
      leads: { Row: LeadRow; Insert: Partial<LeadRow>; Update: Partial<LeadRow> };
      testimonials: { Row: TestimonialRow; Insert: Partial<TestimonialRow>; Update: Partial<TestimonialRow> };
      faq_categories: { Row: FaqCategoryRow; Insert: Partial<FaqCategoryRow>; Update: Partial<FaqCategoryRow> };
      faqs: { Row: FaqRow; Insert: Partial<FaqRow>; Update: Partial<FaqRow> };
      gallery_items: { Row: GalleryItemRow; Insert: Partial<GalleryItemRow>; Update: Partial<GalleryItemRow> };
      media_assets: { Row: MediaAssetRow; Insert: Partial<MediaAssetRow>; Update: Partial<MediaAssetRow> };
      seo_pages: { Row: SeoPageRow; Insert: Partial<SeoPageRow>; Update: Partial<SeoPageRow> };
      homepage_sections: { Row: HomepageSection; Insert: Partial<HomepageSection>; Update: Partial<HomepageSection> };
      activity_logs: { Row: ActivityLogRow; Insert: Partial<ActivityLogRow>; Update: Partial<ActivityLogRow> };
      nav_menus: { Row: NavMenuRow; Insert: Partial<NavMenuRow>; Update: Partial<NavMenuRow> };
      nav_items: { Row: NavItemRow; Insert: Partial<NavItemRow>; Update: Partial<NavItemRow> };
      cms_pages: { Row: CmsPageRow; Insert: Partial<CmsPageRow>; Update: Partial<CmsPageRow> };
      vehicle_categories: { Row: VehicleCategoryRow; Insert: Partial<VehicleCategoryRow>; Update: Partial<VehicleCategoryRow> };
      vehicles: { Row: VehicleRow; Insert: Partial<VehicleRow>; Update: Partial<VehicleRow> };
      airport_routes: { Row: AirportRouteRow; Insert: Partial<AirportRouteRow>; Update: Partial<AirportRouteRow> };
    };
  };
}
