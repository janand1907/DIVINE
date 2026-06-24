'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LeadRow, LeadStatus } from '@/types/database';
import { LEAD_STATUSES } from '@/lib/validation/schemas';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  negotiation: 'Negotiation',
  confirmed: 'Confirmed',
  lost: 'Lost',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-accent text-accent-foreground',
  medium: 'bg-info/10 text-info',
  high: 'bg-warning/10 text-warning',
  urgent: 'bg-destructive/10 text-destructive',
};

interface LeadCardProps {
  lead: LeadRow;
  onMove: (id: string, status: LeadStatus) => Promise<void>;
  onOpen: (lead: LeadRow) => void;
}

function LeadCard({ lead, onMove, onOpen }: LeadCardProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setDragging(true);
        e.dataTransfer.setData('text/plain', lead.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => setDragging(false)}
      onClick={() => onOpen(lead)}
      className={`group cursor-pointer rounded-md border border-border bg-card p-3 shadow-sm transition hover:border-primary hover:shadow-md ${
        dragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-foreground text-sm line-clamp-1">{lead.name}</h4>
        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${PRIORITY_COLORS[lead.priority] ?? ''}`}>
          {lead.priority}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{lead.mobile}</p>
      {lead.destination && (
        <p className="mt-0.5 text-xs text-muted-foreground">→ {lead.destination}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        {lead.assigned_to && (
          <span className="inline-block max-w-[100px] truncate rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary" title={lead.assigned_to}>
            {lead.assigned_to}
          </span>
        )}
      </div>
      {lead.followup_date && (
        <p className="mt-1 text-xs text-warning">Follow-up: {new Date(lead.followup_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
      )}
    </div>
  );
}

interface KanbanBoardProps {
  leads: LeadRow[];
  onLeadUpdated: () => void;
  onOpenLead: (lead: LeadRow) => void;
}

export function KanbanBoard({ leads, onLeadUpdated, onOpenLead }: KanbanBoardProps) {
  const [dropTarget, setDropTarget] = useState<LeadStatus | null>(null);
  const supabase = createClient();

  const leadsByStatus = LEAD_STATUSES.reduce<Record<LeadStatus, LeadRow[]>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {} as Record<LeadStatus, LeadRow[]>);

  const handleMove = async (id: string, status: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;

    const prevStatus = lead.status;
    const newNotes = [
      ...(lead.notes ?? []),
      { at: new Date().toISOString(), by: null, note: `Status moved from ${prevStatus} to ${status}`, status_change: status },
    ];

    const { error } = await supabase
      .from('leads')
      .update({ status, notes: newNotes, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to move lead:', error.message);
      return;
    }
    onLeadUpdated();
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {LEAD_STATUSES.map((status) => (
          <div
            key={status}
            onDragOver={(e) => { e.preventDefault(); setDropTarget(status); }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              setDropTarget(null);
              void handleMove(id, status);
            }}
            className={`flex w-72 flex-shrink-0 flex-col rounded-lg border bg-accent/30 ${
              dropTarget === status ? 'border-primary ring-2 ring-primary/30' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                {leadsByStatus[status].length}
              </span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ minHeight: '120px' }}>
              {leadsByStatus[status].length === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-muted-foreground">Drop leads here</p>
              ) : (
                leadsByStatus[status].map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onMove={handleMove} onOpen={onOpenLead} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
