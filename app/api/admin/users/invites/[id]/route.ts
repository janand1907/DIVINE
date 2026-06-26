import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('admin_invites').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity({ action: 'delete', entity: 'admin_invite', entityId: params.id, metadata: {}, userEmail: session.email });
  return new NextResponse(null, { status: 204 });
}
