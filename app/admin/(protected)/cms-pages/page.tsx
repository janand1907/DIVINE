import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';

export default async function AdminCmsPagesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('cms_pages')
    .select('id,slug,title,page_type,is_published,updated_at')
    .order('updated_at', { ascending: false });

  const pages = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">CMS Pages</h2>
          <p className="text-sm text-muted-foreground">{pages.length} pages</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms-pages/new"><Plus className="mr-2 h-4 w-4" /> New Page</Link>
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
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No CMS pages yet. Click &quot;New Page&quot; to create one.
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
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                  {new Date(page.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/cms-pages/${page.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteButton href={`/api/admin/cms-pages/${page.id}`} />
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
