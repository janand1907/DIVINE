import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';
import type { PackageRow } from '@/types/database';

type PackageListItem = Pick<
  PackageRow,
  'id' | 'slug' | 'title' | 'subtitle' | 'is_published' | 'is_featured' | 'starting_price' | 'updated_at' | 'category_id' | 'destination_id'
>;

export default async function AdminPackagesPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('packages')
    .select('id,slug,title,subtitle,is_published,is_featured,starting_price,updated_at,category_id,destination_id')
    .order('updated_at', { ascending: false })
    .returns<PackageListItem[]>();

  const packages = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Packages</h2>
          <p className="text-sm text-muted-foreground">{packages.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">
            <Plus className="mr-2 h-4 w-4" /> New Package
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No packages yet. Click “New Package” to create one.
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium text-foreground">
                    {pkg.title}
                    {pkg.subtitle ? (
                      <span className="block text-xs text-muted-foreground">{pkg.subtitle}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                    {pkg.slug}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {pkg.starting_price != null
                      ? `₹${pkg.starting_price.toLocaleString('en-IN')}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {pkg.is_published ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {pkg.is_featured ? <Badge variant="secondary">Featured</Badge> : '—'}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {new Date(pkg.updated_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label={`Edit ${pkg.title}`}>
                        <Link href={`/admin/packages/${pkg.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton href={`/api/admin/packages/${pkg.id}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
