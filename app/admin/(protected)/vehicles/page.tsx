import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';

export default async function AdminVehiclesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('vehicles')
    .select('id,slug,name,category_id,seats,starting_price,is_published,is_featured,is_ac,updated_at')
    .order('updated_at', { ascending: false });

  const vehicles = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Vehicles</h2>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/new"><Plus className="mr-2 h-4 w-4" /> New Vehicle</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Starting Price</TableHead>
              <TableHead>AC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No vehicles yet. Click "New Vehicle" to add one.
                </TableCell>
              </TableRow>
            ) : vehicles.map((v: any) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium text-foreground">
                  {v.name}
                  {v.is_featured && <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>}
                </TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.starting_price ? `₹${Number(v.starting_price).toLocaleString('en-IN')}` : '—'}</TableCell>
                <TableCell>{v.is_ac ? <Badge variant="outline">AC</Badge> : '—'}</TableCell>
                <TableCell>
                  {v.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/vehicles/${v.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteButton href={`/api/admin/vehicles/${v.id}`} />
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
