import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlogForm } from '@/components/admin/blog-form';
import { Button } from '@/components/ui/button';

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to blog">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">New Blog Post</h2>
      </div>
      <BlogForm />
    </div>
  );
}
