import { requireAdmin } from '@/lib/admin/guard';
import { createAdminClient } from '@/lib/supabase/server';
import type { FaqRow, FaqCategoryRow } from '@/types/database';
import { FaqManager } from '@/components/admin/faq-manager';

export const metadata = { title: 'FAQs — Admin' };

export default async function FaqsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: faqs }, { data: categories }] = await Promise.all([
    supabase.from('faqs').select('*').order('display_order', { ascending: true }),
    supabase.from('faq_categories').select('*').order('display_order', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">FAQs</h1>
        <p className="text-muted-foreground">Manage frequently asked questions and categories.</p>
      </div>
      <FaqManager initialFaqs={(faqs as FaqRow[]) ?? []} initialCategories={(categories as FaqCategoryRow[]) ?? []} />
    </div>
  );
}
