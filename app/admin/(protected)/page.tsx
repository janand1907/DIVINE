import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { Users, TrendingUp, Clock, CircleAlert as AlertCircle, Package, FileText } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import {
  ConversionFunnel,
  PriorityDistribution,
  DailyLeadsChart,
  LeadSourceChart,
} from '@/components/admin/analytics-charts';
import { DateRangeFilterWrapper } from '@/components/admin/date-range-filter-wrapper';
import type { LeadRow } from '@/types/database';

interface AdminDashboardProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const supabase = createAdminClient();

  // Get date range from search params (default: 30 days)
  const range = (searchParams?.range as '7' | '30' | '90' | 'all' | undefined) ?? '30';

  // Calculate cutoff date based on range
  let cutoffDate: string | null = null;
  const now = new Date();

  if (range !== 'all') {
    const daysBack = parseInt(range, 10);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - daysBack);
    cutoffDate = cutoff.toISOString().slice(0, 10);
  }

  // Fetch all leads (with optional date filtering)
  let query = supabase
    .from('leads')
    .select('id, status, priority, source, followup_date, created_at, name, mobile, destination')
    .order('created_at', { ascending: false })
    .limit(500);

  if (cutoffDate) {
    query = query.gte('created_at', cutoffDate);
  }

  const { data: leadsByStatus } = await query.returns<Partial<LeadRow>[]>();

  const allLeads = leadsByStatus ?? [];
  const totalLeads = allLeads.length;
  const statusCounts = allLeads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status ?? 'new'] = (acc[l.status ?? 'new'] ?? 0) + 1;
    return acc;
  }, {});
  const confirmedCount = statusCounts['confirmed'] ?? 0;
  const newCount = statusCounts['new'] ?? 0;

  const today = new Date().toISOString().slice(0, 10);
  const followupsDueToday = allLeads.filter((l) => l.followup_date === today).length;
  const highPriorityNew = allLeads.filter((l) => l.status === 'new' && l.priority === 'high').length;

  // Counts for content
  const [pkgs, blogs, testimonials, media] = await Promise.all([
    supabase.from('packages').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }),
  ]);

  const recentLeads = allLeads.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={<Users className="h-5 w-5" />}
          accent="primary"
        />
        <StatCard
          title="New (Awaiting Action)"
          value={newCount}
          icon={<AlertCircle className="h-5 w-5" />}
          accent="secondary"
        />
        <StatCard
          title="Follow-ups Due Today"
          value={followupsDueToday}
          icon={<Clock className="h-5 w-5" />}
          accent="warning"
        />
        <StatCard
          title="Confirmed"
          value={confirmedCount}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="success"
        />
      </div>

      {/* Content inventory */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Published Packages" value={pkgs.count ?? 0} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Blog Posts" value={blogs.count ?? 0} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Testimonials" value={testimonials.count ?? 0} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Media Assets" value={media.count ?? 0} icon={<FileText className="h-5 w-5" />} />
      </div>

      {/* Date Range Filter - Client Component */}
      <DateRangeFilterWrapper currentRange={range} />

      {/* Conversion Funnel and Priority Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ConversionFunnel leads={allLeads} />
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold text-foreground px-2">Priority Distribution</h3>
          <PriorityDistribution leads={allLeads} />
        </div>
      </div>

      {/* Daily Leads Chart */}
      <DailyLeadsChart leads={allLeads} />

      {/* Lead Source Chart and Recent Leads */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadSourceChart leads={allLeads} />

        {/* Recent leads */}
        <div className="rounded-lg border border-border bg-card shadow-brand">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">Recent Leads</h2>
            <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline">All leads →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/leads"
                  className="flex items-center justify-between gap-3 p-5 transition hover:bg-accent"
                >
                  <div>
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.mobile}{lead.destination ? ` · ${lead.destination}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs capitalize text-primary">{lead.status}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(lead.created_at ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Lead pipeline by status */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Lead Pipeline</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {['new', 'contacted', 'quoted', 'negotiation', 'confirmed', 'lost'].map((status) => (
            <div key={status} className="rounded-md border border-border bg-accent p-3 text-center">
              <p className="font-heading text-2xl font-semibold text-foreground">{statusCounts[status] ?? 0}</p>
              <p className="text-xs capitalize text-muted-foreground">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {highPriorityNew > 0 && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-5">
          <p className="font-medium text-secondary">
            {highPriorityNew} high-priority lead{highPriorityNew === 1 ? '' : 's'} awaiting first contact.
          </p>
        </div>
      )}
    </div>
  );
}

