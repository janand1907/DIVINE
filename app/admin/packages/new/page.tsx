import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PackageForm } from '@/components/admin/package-form';
import { Button } from '@/components/ui/button';

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to packages">
          <Link href="/admin/packages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="font-heading text-xl font-semibold text-foreground">New Package</h2>
      </div>
      <PackageForm />
    </div>
  );
}
