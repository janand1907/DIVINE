import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TestimonialStandalone } from '@/components/admin/testimonial-standalone';
import { Button } from '@/components/ui/button';

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to testimonials">
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">New Testimonial</h2>
      </div>
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <TestimonialStandalone />
      </div>
    </div>
  );
}
