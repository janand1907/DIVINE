'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import type { TestimonialRow } from '@/types/database';

/** Client wrapper around TestimonialForm for the standalone /new page. */
export function TestimonialStandalone() {
  const router = useRouter();

  const onSaved = (row: TestimonialRow) => {
    toast.success('Testimonial created');
    router.push('/admin/testimonials');
    router.refresh();
  };

  return <TestimonialForm onSaved={onSaved} />;
}
