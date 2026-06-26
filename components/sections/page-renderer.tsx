import { fetchSections } from '@/lib/sections/registry';
import type { SectionEntityType, PageSectionRow } from '@/types/database';
import { HeroBanner } from './hero-banner';
import { RichText } from './rich-text';
import { ImageTextSplit } from './image-text-split';
import { ImageGallery } from './image-gallery';
import { ImageBanner } from './image-banner';
import { VideoSection } from './video-section';
import { Timeline } from './timeline';
import { PackageGrid } from './package-grid';
import { DestinationGrid } from './destination-grid';
import { VehicleGrid } from './vehicle-grid';
import { TransferGrid } from './transfer-grid';
import { BlogGrid } from './blog-grid';
import { Testimonials } from './testimonials';
import { Faq } from './faq';
import { FeatureCards } from './feature-cards';
import { Statistics } from './statistics';
import { PricingCards } from './pricing-cards';
import { EnquiryForm } from './enquiry-form';
import { CtaBanner } from './cta-banner';
import { WhatsappCta } from './whatsapp-cta';
import { GoogleMap } from './google-map';
import { HtmlBlock } from './html-block';

const COMPONENTS: Record<string, React.ComponentType<{ config: Record<string, unknown>; entityId?: string; entityType?: string }>> = {
  hero_banner: HeroBanner,
  rich_text: RichText,
  image_text_split: ImageTextSplit,
  image_gallery: ImageGallery,
  image_banner: ImageBanner,
  video_section: VideoSection,
  timeline: Timeline,
  package_grid: PackageGrid,
  destination_grid: DestinationGrid,
  vehicle_grid: VehicleGrid,
  transfer_grid: TransferGrid,
  blog_grid: BlogGrid,
  testimonials: Testimonials,
  faq: Faq,
  feature_cards: FeatureCards,
  statistics: Statistics,
  pricing_cards: PricingCards,
  enquiry_form: EnquiryForm,
  cta_banner: CtaBanner,
  whatsapp_cta: WhatsappCta,
  google_map: GoogleMap,
  html_block: HtmlBlock,
};

interface PageRendererProps {
  entityType: SectionEntityType;
  entityId: string;
  fallback?: React.ReactNode;
}

export async function PageRenderer({ entityType, entityId, fallback }: PageRendererProps) {
  const sections = await fetchSections(entityType, entityId);

  if (sections.length === 0 && fallback) {
    return <>{fallback}</>;
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section: PageSectionRow) => {
        const Component = COMPONENTS[section.section_type];
        if (!Component) return null;
        return (
          <Component
            key={section.id}
            config={section.config}
            entityId={entityId}
            entityType={entityType}
          />
        );
      })}
    </>
  );
}
