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

export interface FooterLink {
  label: string;
  url: string;
  open_new_tab?: boolean;
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
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
  social_linkedin: string | null;
  footer_links: FooterLink[];
  footer_keywords: string[];
  footer_tagline: string | null;
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
  cover_video: string | null;
  nav_label: string | null;
  badge_text: string | null;
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
  tour_type: string | null;
  badge_text: string | null;
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
  | 'hotel-assistance'
  | 'blog-cta'
  | 'content-page-cta';

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
  vehicle_id: string | null;
  route_id: string | null;
  content_page_id: string | null;
  module_source: string | null;
  form_key: string | null;
  extra_data: Record<string, unknown> | null;
  hotel_data: HotelLeadData | null;
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
  module: string | null;
  entity_id: string | null;
  entity_type: string | null;
  folder: string | null;
  asset_type: string;
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
  pool_entity_id: string | null;
  open_in_new_tab: boolean;
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
  icon: string | null;
  badge_text: string | null;
  pool_entity_id: string | null;
  open_in_new_tab: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NavMenuWithItems extends NavMenuRow {
  nav_items: NavItemRow[];
}

// ── Module Nav Pool ──────────────────────────────────────────
export interface ModuleNavPoolRow {
  id: string;
  module: string;
  entity_type: string;
  entity_id: string;
  label: string;
  url: string;
  cover_image: string | null;
  badge_text: string | null;
  is_published: boolean;
  updated_at: string;
}

// ── Content Pages ────────────────────────────────────────────
export interface ContentPageRow {
  id: string;
  slug: string;
  title: string;
  page_type: string;
  module: string | null;
  entity_id: string | null;
  entity_type: string | null;
  is_published: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  robots_index: boolean;
  schema_type: string;
  created_at: string;
  updated_at: string;
}

// ── Page Sections ────────────────────────────────────────────
export type SectionType =
  | 'hero_banner'
  | 'rich_text'
  | 'image_text_split'
  | 'image_gallery'
  | 'image_banner'
  | 'video_section'
  | 'timeline'
  | 'package_grid'
  | 'destination_grid'
  | 'vehicle_grid'
  | 'transfer_grid'
  | 'blog_grid'
  | 'testimonials'
  | 'faq'
  | 'feature_cards'
  | 'statistics'
  | 'pricing_cards'
  | 'enquiry_form'
  | 'cta_banner'
  | 'whatsapp_cta'
  | 'google_map'
  | 'html_block';

export type SectionEntityType =
  | 'content_page'
  | 'destination'
  | 'vehicle'
  | 'vehicle_category'
  | 'package'
  | 'route'
  | 'blog'
  | 'global';

export interface PageSectionRow {
  id: string;
  entity_type: SectionEntityType;
  entity_id: string;
  section_type: SectionType;
  label: string | null;
  config: Record<string, unknown>;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ── CMS Pages (legacy, being replaced by content_pages) ─────
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
  fuel_type: string | null;
  transmission: string | null;
  badge_text: string | null;
  video_url: string | null;
  availability_note: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehiclePricingRow {
  id: string;
  vehicle_id: string;
  pricing_type: string;
  label: string;
  base_price: number;
  included_km: number | null;
  included_hours: number | null;
  extra_per_km: number | null;
  extra_per_hour: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
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
  pickup_area: string | null;
  drop_area: string | null;
  route_type: string;
  is_return_available: boolean;
  popular_rank: number | null;
  cover_image: string | null;
  content: string | null;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransferVehicleTypeRow {
  id: string;
  slug: string;
  name: string;
  seats: number;
  luggage_pieces: number | null;
  image: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface TransferPricingRow {
  id: string;
  route_id: string;
  vehicle_type_id: string;
  base_price: number;
  return_price: number | null;
  extra_per_km: number | null;
  toll_extra: number | null;
  waiting_charge_per_hour: number | null;
  night_surcharge: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

// ── Enquiry Form Configs ─────────────────────────────────────
export interface EnquiryFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

export interface EnquiryFormConfigRow {
  id: string;
  form_key: string;
  title: string;
  description: string | null;
  submit_label: string;
  success_message: string;
  lead_source: string;
  lead_priority: LeadPriority;
  module: string | null;
  notify_email: string | null;
  whatsapp_template: string | null;
  fields: EnquiryFieldConfig[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Hotel (Phase 2 — designed, tables exist) ─────────────────
export interface HotelCityRow {
  id: string;
  slug: string;
  name: string;
  state: string | null;
  region: string | null;
  cover_image: string | null;
  description: string | null;
  is_published: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

// ── Admin Invites ─────────────────────────────────────────────
export interface AdminInviteRow {
  id: string;
  code: string;
  created_by: string;
  email_hint: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

// ── Popular Taxi Routes ───────────────────────────────────────
export interface PopularRouteCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PopularRouteRow {
  id: string;
  category_id: string;
  label: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface PopularRouteCategoryWithRoutes extends PopularRouteCategoryRow {
  popular_routes: PopularRouteRow[];
}

// ── Tariff ────────────────────────────────────────────────────
export interface TariffEntryRow {
  id: string;
  vehicle: string;
  seats: number | null;
  price_4h_40km: number | null;
  price_8h_80km: number | null;
  extra_per_km: number | null;
  extra_per_hour: number | null;
  outstation_price: number | null;
  driver_bata: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Database type map ────────────────────────────────────────
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
      module_nav_pool: { Row: ModuleNavPoolRow; Insert: Partial<ModuleNavPoolRow>; Update: Partial<ModuleNavPoolRow> };
      content_pages: { Row: ContentPageRow; Insert: Partial<ContentPageRow>; Update: Partial<ContentPageRow> };
      page_sections: { Row: PageSectionRow; Insert: Partial<PageSectionRow>; Update: Partial<PageSectionRow> };
      cms_pages: { Row: CmsPageRow; Insert: Partial<CmsPageRow>; Update: Partial<CmsPageRow> };
      vehicle_categories: { Row: VehicleCategoryRow; Insert: Partial<VehicleCategoryRow>; Update: Partial<VehicleCategoryRow> };
      vehicles: { Row: VehicleRow; Insert: Partial<VehicleRow>; Update: Partial<VehicleRow> };
      vehicle_pricing: { Row: VehiclePricingRow; Insert: Partial<VehiclePricingRow>; Update: Partial<VehiclePricingRow> };
      airport_routes: { Row: AirportRouteRow; Insert: Partial<AirportRouteRow>; Update: Partial<AirportRouteRow> };
      transfer_vehicle_types: { Row: TransferVehicleTypeRow; Insert: Partial<TransferVehicleTypeRow>; Update: Partial<TransferVehicleTypeRow> };
      transfer_pricing: { Row: TransferPricingRow; Insert: Partial<TransferPricingRow>; Update: Partial<TransferPricingRow> };
      enquiry_form_configs: { Row: EnquiryFormConfigRow; Insert: Partial<EnquiryFormConfigRow>; Update: Partial<EnquiryFormConfigRow> };
      hotel_cities: { Row: HotelCityRow; Insert: Partial<HotelCityRow>; Update: Partial<HotelCityRow> };
      admin_invites: { Row: AdminInviteRow; Insert: Partial<AdminInviteRow>; Update: Partial<AdminInviteRow> };
      popular_route_categories: { Row: PopularRouteCategoryRow; Insert: Partial<PopularRouteCategoryRow>; Update: Partial<PopularRouteCategoryRow> };
      popular_routes: { Row: PopularRouteRow; Insert: Partial<PopularRouteRow>; Update: Partial<PopularRouteRow> };
      tariff_entries: { Row: TariffEntryRow; Insert: Partial<TariffEntryRow>; Update: Partial<TariffEntryRow> };
    };
  };
}
