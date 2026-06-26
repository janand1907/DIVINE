import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';
import type { AirportRouteRow } from '@/types/database';

export default async function AdminAirportRoutesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('airport_routes')
    .select()
    .order('from_city')
    .returns<AirportRouteRow[]>();

  const routes = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Airport Transfer Routes</h2>
          <p className="text-sm text-muted-foreground">{routes.length} routes</p>
        </div>
        <Button asChild>
          <Link href="/admin/airport-routes/new"><Plus className="mr-2 h-4 w-4" /> New Route</Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Vehicles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No routes yet. Click &quot;New Route&quot; to add one.
                </TableCell>
              </TableRow>
            ) : routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium text-foreground">
                  {route.from_city} → {route.to_city}
                </TableCell>
                <TableCell className="text-muted-foreground">{route.distance_km ? `${route.distance_km} km` : '—'}</TableCell>
                <TableCell className="text-muted-foreground">{route.duration_hours ? `${route.duration_hours} hrs` : '—'}</TableCell>
                <TableCell>{route.vehicles.length} options</TableCell>
                <TableCell>
                  {route.is_active ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/airport-routes/${route.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteButton href={`/api/admin/airport-routes/${route.id}`} />
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
