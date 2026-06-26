'use client';

import { useState } from 'react';
import type { AdminInviteRow } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Plus, Trash2, Copy, CheckCheck, Users, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

interface AdminUsersManagerProps {
  initialInvites: AdminInviteRow[];
  users: AdminUser[];
}

export function AdminUsersManager({ initialInvites, users }: AdminUsersManagerProps) {
  const [invites, setInvites] = useState<AdminInviteRow[]>(initialInvites);
  const [emailHint, setEmailHint] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const getInviteUrl = (code: string) => {
    if (typeof window === 'undefined') return `/auth/accept-invite/${code}`;
    return `${window.location.origin}/auth/accept-invite/${code}`;
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(getInviteUrl(code)).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
      toast.success('Invite link copied');
    });
  };

  const createInvite = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_hint: emailHint || null }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to create invite'); return; }
      setInvites((prev) => [data, ...prev]);
      setEmailHint('');
      toast.success('Invite link created');
    } catch {
      toast.error('Network error');
    } finally {
      setCreating(false);
    }
  };

  const deleteInvite = async (id: string) => {
    if (!confirm('Delete this invite link?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users/invites/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success('Invite deleted');
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(null);
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="space-y-8">
      {/* Current Users */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-brand">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-base font-semibold text-foreground">Current Admin Users</h2>
        </div>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Admin</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Invite */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-brand">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-base font-semibold text-foreground">Invite New Admin</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate an invite link and share it with the person you want to add as an admin.
          The link expires in 7 days and can only be used once.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="email_hint">Email (optional hint)</Label>
            <Input
              id="email_hint"
              type="email"
              value={emailHint}
              onChange={(e) => setEmailHint(e.target.value)}
              placeholder="new-admin@yourcompany.com"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={createInvite} disabled={creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Generate Link
            </Button>
          </div>
        </div>
      </section>

      {/* Invite List */}
      {invites.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-6 shadow-brand">
          <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Invite Links</h2>
          <div className="space-y-2">
            {invites.map((invite) => {
              const expired = isExpired(invite.expires_at);
              const used = !!invite.used_at;
              return (
                <div key={invite.id} className={`flex items-center justify-between rounded-md border border-border p-3 ${(expired || used) ? 'opacity-60' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      {invite.email_hint && <p className="text-sm font-medium text-foreground">{invite.email_hint}</p>}
                      {used && <Badge variant="secondary">Used</Badge>}
                      {!used && expired && <Badge variant="destructive">Expired</Badge>}
                      {!used && !expired && <Badge className="bg-green-500/10 text-green-700">Active</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created by {invite.created_by} · Expires {new Date(invite.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!used && !expired && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(invite.code)}
                      >
                        {copied === invite.code ? <CheckCheck className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                        {copied === invite.code ? 'Copied' : 'Copy Link'}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteInvite(invite.id)}
                      disabled={deleting === invite.id}
                    >
                      {deleting === invite.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
