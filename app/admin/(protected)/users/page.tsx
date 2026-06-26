import { requireAdmin } from '@/lib/admin/guard';
import { createAdminClient } from '@/lib/supabase/server';
import type { AdminInviteRow } from '@/types/database';
import { AdminUsersManager } from '@/components/admin/admin-users-manager';

export const metadata = { title: 'Admin Users — Admin' };

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [{ data: invites }, usersResult] = await Promise.all([
    supabase.from('admin_invites').select('*').order('created_at', { ascending: false }),
    supabase.auth.admin.listUsers(),
  ]);

  const users = usersResult.data?.users ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Users</h1>
        <p className="text-muted-foreground">Manage admin accounts and invite new team members.</p>
      </div>
      <AdminUsersManager
        initialInvites={(invites as AdminInviteRow[]) ?? []}
        users={users.map((u) => ({ id: u.id, email: u.email ?? '', created_at: u.created_at ?? '' }))}
      />
    </div>
  );
}
