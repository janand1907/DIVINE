'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import type { LeadRow, LeadStatus, LeadPriority } from '@/types/database';
import { LEAD_STATUSES, LEAD_PRIORITIES } from '@/lib/validation/schemas';
import { Loader2, Save, Trash2, MessageCircle } from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: LeadRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
  whatsappNumber: string;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', quoted: 'Quoted',
  negotiation: 'Negotiation', confirmed: 'Confirmed', lost: 'Lost',
};

export function LeadDetailDrawer({
  lead, open, onOpenChange, onUpdated, whatsappNumber,
}: LeadDetailDrawerProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', destination: '', travel_date: '',
    adults: 0, children: 0, budget: '', message: '',
    status: 'new' as LeadStatus, assigned_to: '', followup_date: '',
    priority: 'medium' as LeadPriority,
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name, mobile: lead.mobile, email: lead.email ?? '',
        destination: lead.destination ?? '', travel_date: lead.travel_date ?? '',
        adults: lead.adults ?? 0, children: lead.children ?? 0,
        budget: lead.budget ?? '', message: lead.message ?? '',
        status: lead.status, assigned_to: lead.assigned_to ?? '',
        followup_date: lead.followup_date ?? '', priority: lead.priority,
      });
      setNewNote('');
    }
  }, [lead]);

  if (!lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('leads').update({
        ...form,
        email: form.email || null,
        destination: form.destination || null,
        travel_date: form.travel_date || null,
        budget: form.budget || null,
        message: form.message || null,
        assigned_to: form.assigned_to || null,
        followup_date: form.followup_date || null,
        updated_at: new Date().toISOString(),
      }).eq('id', lead.id);
      if (error) throw error;
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const notes = [
      ...(lead.notes ?? []),
      { at: new Date().toISOString(), by: null, note: newNote.trim(), status_change: null },
    ];
    const { error } = await supabase.from('leads').update({
      notes, updated_at: new Date().toISOString(),
    }).eq('id', lead.id);
    if (error) { console.error(error); return; }
    setNewNote('');
    onUpdated();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead permanently?')) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('leads').delete().eq('id', lead.id);
      if (error) throw error;
      onUpdated();
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {lead.name}
            <Badge variant="outline" className="capitalize">{lead.status}</Badge>
            <Badge variant="secondary" className="capitalize">{lead.priority}</Badge>
          </DialogTitle>
          <DialogDescription>
            Lead from <span className="capitalize">{lead.source.replace('-', ' ')}</span> · Created {new Date(lead.created_at).toLocaleString('en-IN')}
            {lead.landing_page && (<> · Landed: {new URL(lead.landing_page).pathname}</>)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Editable fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Mobile *</Label>
              <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Travel Date</Label>
              <Input type="date" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Budget</Label>
              <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
              >
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as LeadPriority })}
              >
                {LEAD_PRIORITIES.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Assigned To</Label>
              <Input value={form.assigned_to} placeholder="agent email" onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Follow-up Date</Label>
              <Input type="date" value={form.followup_date} onChange={(e) => setForm({ ...form, followup_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Adults</Label>
              <Input type="number" min={0} value={form.adults} onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Children</Label>
              <Input type="number" min={0} value={form.children} onChange={(e) => setForm({ ...form, children: Number(e.target.value) })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          {/* Lead context (read-only) */}
          <div className="rounded-md border border-border bg-accent p-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Source & Attribution</p>
            <p className="mt-1"><strong>Source:</strong> <span className="capitalize">{lead.source.replace('-', ' ')}</span></p>
            {lead.package_slug && <p><strong>Package:</strong> {lead.package_slug}</p>}
            {lead.utm_source && <p><strong>UTM source:</strong> {lead.utm_source}</p>}
            {lead.utm_campaign && <p><strong>UTM campaign:</strong> {lead.utm_campaign}</p>}
            {lead.landing_page && <p><strong>Landing page:</strong> {new URL(lead.landing_page).pathname}</p>}
          </div>

          {/* Notes timeline */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes & status history</p>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto rounded-md border border-border bg-card p-3">
              {(lead.notes ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                [...lead.notes].reverse().map((note, i) => (
                  <div key={i} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <p className="text-sm text-foreground">{note.note}</p>
                    <p className="text-xs text-muted-foreground">{new Date(note.at).toLocaleString('en-IN')}{note.by ? ` · ${note.by}` : ''}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <Input placeholder="Add note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }} />
              <Button size="sm" onClick={handleAddNote}>Add</Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
            <a
              href={`https://wa.me/${lead.mobile.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, regarding your inquiry...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-whatsapp px-3 py-2 text-sm font-medium text-brand-whatsappForeground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp lead
            </a>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
