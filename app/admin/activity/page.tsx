import { createServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ActivityLogRow } from '@/types/database';

const actionVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  create: 'default',
  update: 'secondary',
  delete: 'destructive',
  publish: 'default',
  unpublish: 'outline',
  status_change: 'secondary',
  login: 'outline',
  logout: 'outline',
};

function summarizeMetadata(meta: Record<string, unknown> | null): string {
  if (!meta) return '—';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(meta)) {
    if (value == null) continue;
    parts.push(`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
  }
  return parts.length ? parts.slice(0, 3).join(' · ') : '—';
}

export default async function AdminActivityPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('activity_logs')
    .select()
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<ActivityLogRow[]>();

  const logs = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Activity Log</h2>
        <p className="text-sm text-muted-foreground">
          Showing the latest {logs.length} {logs.length === 1 ? 'event' : 'events'}. Read-only.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="hidden md:table-cell">Entity ID</TableHead>
              <TableHead className="hidden lg:table-cell">Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{log.user_email ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={actionVariant[log.action] ?? 'outline'}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{log.entity}</TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                    {log.entity_id ? log.entity_id.slice(0, 8) : '—'}
                  </TableCell>
                  <TableCell className="hidden max-w-md truncate text-sm text-muted-foreground lg:table-cell">
                    {summarizeMetadata(log.metadata)}
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
