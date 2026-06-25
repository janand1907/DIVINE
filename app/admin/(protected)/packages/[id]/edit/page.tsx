import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { PackageForm } from '@/components/admin/package-form';
import { Button } from '@/components/ui/button';
import type { PackageRow } from '@/types/database';

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('packages')
    .select()
    .eq('id', params.id)
    .single<PackageRow>();

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to packages">
          <Link href="/admin/packages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">Edit Package</h2>
      </div>
      <PackageForm initialValues={data} />
    </div>
  );
}
