import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Plus, Pencil, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';

export default async function AdminContentPagesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('content_pages')
    .select('*')
    .order('display_order', { ascending: true });

  const pages = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Content Pages</h2>
          <p className="text-sm text-muted-foreground">
            {pages.length} page{pages.length !== 1 ? 's' : ''} &mdash; section-based page builder
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content-pages/new"><Plus className="mr-2 h-4 w-4" /> New Page</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Module</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No content pages yet. Click &quot;New Page&quot; to create one.
                </TableCell>
              </TableRow>
            ) : pages.map((page: any) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium text-foreground">{page.title}</TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">/{page.slug}</TableCell>
                <TableCell><Badge variant="secondary">{page.page_type}</Badge></TableCell>
                <TableCell>
                  {page.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                  {page.module || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" title="Page Builder">
                      <Link href={`/admin/content-pages/${page.id}/builder`}>
                        <Layers className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" title="Edit Settings">
                      <Link href={`/admin/content-pages/new?edit=${page.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteButton href={`/api/admin/content-pages/${page.id}`} redirectTo="/admin/content-pages" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
