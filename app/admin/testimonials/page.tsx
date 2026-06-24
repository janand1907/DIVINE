import { createServerClient } from '@/lib/supabase/server';
import { TestimonialsManager } from '@/components/admin/testimonials-manager';
import type { TestimonialRow } from '@/types/database';

export default async function AdminTestimonialsPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('testimonials')
    .select()
    .order('created_at', { ascending: false })
    .returns<TestimonialRow[]>();

  return <TestimonialsManager items={data ?? []} />;
}
