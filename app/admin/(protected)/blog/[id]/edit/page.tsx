import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { BlogForm } from '@/components/admin/blog-form';
import { Button } from '@/components/ui/button';
import type { BlogRow } from '@/types/database';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('blogs')
    .select()
    .eq('id', params.id)
    .single<BlogRow>();

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to blog">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">Edit Blog Post</h2>
      </div>
      <BlogForm initialValues={data} />
    </div>
  );
}
