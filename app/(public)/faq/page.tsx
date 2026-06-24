import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { faqJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/layout/json-ld';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeading } from '@/components/layout/section-heading';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { FaqCategoryRow, FaqRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/faq');
  return buildMetadata({ path: '/faq', theme, site, seoPage });
}

interface GroupedFaqs {
  category: FaqCategoryRow | null;
  faqs: FaqRow[];
}

export default async function FaqPage() {
  const supabase = createPublicClient();

  const [categoriesRes, faqsRes] = await Promise.all([
    supabase
      .from('faq_categories')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .returns<FaqCategoryRow[]>(),
    supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .returns<FaqRow[]>(),
  ]);

  const categories = (categoriesRes.data ?? []).sort(
    (a, b) => a.display_order - b.display_order
  );
  const allFaqs = (faqsRes.data ?? []).sort(
    (a, b) => a.display_order - b.display_order
  );

  const { site } = await fetchSeoContext('/faq');
  const siteUrl = site?.site_url ?? undefined;

  // Group FAQs by category — uncategorized FAQs are grouped under a null category.
  const grouped: GroupedFaqs[] = [];

  if (categories.length > 0) {
    for (const cat of categories) {
      const faqsForCat = allFaqs.filter((f) => f.category_id === cat.id);
      if (faqsForCat.length > 0) {
        grouped.push({ category: cat, faqs: faqsForCat });
      }
    }
    // Append uncategorized FAQs (no category_id or category_id not in published categories)
    const uncategorized = allFaqs.filter(
      (f) => !f.category_id || !categories.some((c) => c.id === f.category_id)
    );
    if (uncategorized.length > 0) {
      grouped.push({ category: null, faqs: uncategorized });
    }
  } else {
    // No categories published — show all FAQs in one group.
    grouped.push({ category: null, faqs: allFaqs });
  }

  // Build FAQPage JSON-LD from all FAQs (best-effort, even if empty).
  const faqItems = allFaqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      {/* FAQPage JSON-LD structured data */}
      {faqItems.length > 0 && (
        <JsonLd data={faqJsonLd(faqItems)} />
      )}

      {/* Hero */}
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'FAQ', href: '/faq' },
            ]}
            siteUrl={siteUrl}
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Answers to common questions about our tours, bookings, payments, and travel policies.
          </p>
        </div>
      </section>

      {/* FAQ accordions */}
      <section className="bg-background py-12">
        <div className="container-brand max-w-3xl">
          {allFaqs.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <SectionHeading
                title="No FAQs available yet"
                subtitle="Please reach out to us directly with any questions."
                align="center"
              />
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map((group, gIdx) => (
                <div key={group.category?.id ?? `uncategorized-${gIdx}`}>
                  {group.category && (
                    <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                      {group.category.name}
                    </h2>
                  )}
                  <Accordion
                    type="single"
                    collapsible
                    className="rounded-lg border border-border bg-card px-4 shadow-brand"
                  >
                    {group.faqs.map((faq, fIdx) => {
                      const itemValue = `${group.category?.id ?? 'general'}-${faq.id ?? fIdx}`;
                      return (
                        <AccordionItem key={faq.id ?? fIdx} value={itemValue}>
                          <AccordionTrigger className="text-left text-foreground hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
