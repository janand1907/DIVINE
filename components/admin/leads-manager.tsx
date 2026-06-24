'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LeadRow, LeadStatus } from '@/types/database';
import { KanbanBoard } from '@/components/admin/kanban-board';
import { LeadDetailDrawer } from '@/components/admin/lead-detail-drawer';
import { Loader2, LayoutGrid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeadsManagerProps {
  whatsappNumber: string;
  adminEmail: string;
}

const STATUS_FILTERS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'lost', label: 'Lost' },
];

export function LeadsManager({ whatsappNumber }: LeadsManagerProps) {
  const supabase = createClient();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) console.error('Failed to fetch leads:', error);
    setLeads((data ?? []) as LeadRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.mobile.includes(q) || (l.destination ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  const openLead = (lead: LeadRow) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
          >
            {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-48"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard
          leads={statusFilter === 'all' ? filtered : filtered}
          onLeadUpdated={fetchLeads}
          onOpenLead={openLead}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-brand">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-accent text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No leads found.</td></tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className="cursor-pointer transition hover:bg-accent"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.destination ?? '—'}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs capitalize text-primary">{lead.status}</span></td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{lead.priority}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.assigned_to ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.followup_date ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <LeadDetailDrawer
        lead={selectedLead}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdated={fetchLeads}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
