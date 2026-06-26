'use client';

import { useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { LeadRow, LeadStatus, LeadPriority } from '@/types/database';

interface AnalyticsChartsProps {
  leads: Partial<LeadRow>[];
  selectedRange: '7' | '30' | '90' | 'all';
  onRangeChange: (range: '7' | '30' | '90' | 'all') => void;
}

const RANGE_LABELS = {
  '7': '7 Days',
  '30': '30 Days',
  '90': '90 Days',
  'all': 'All Time',
};

const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'quoted', 'negotiation', 'confirmed', 'lost'];
const PRIORITY_ORDER: LeadPriority[] = ['low', 'medium', 'high', 'urgent'];
const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
const PRIORITY_COLORS: Record<LeadPriority, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#7c3aed',
};

/**
 * Date Range Filter Component
 */
export function DateRangeFilter({ selectedRange, onRangeChange }: Pick<AnalyticsChartsProps, 'selectedRange' | 'onRangeChange'>) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-brand">
      <p className="mb-3 text-sm font-medium text-foreground">Filter by date:</p>
      <div className="flex flex-wrap gap-2">
        {(['7', '30', '90', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => onRangeChange(range)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              selectedRange === range
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-foreground hover:bg-accent'
            }`}
          >
            {RANGE_LABELS[range]}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Conversion Funnel Component (Pure Tailwind/CSS)
 */
export function ConversionFunnel({ leads }: Pick<AnalyticsChartsProps, 'leads'>) {
  const totalLeads = leads.length;

  if (totalLeads === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Conversion Funnel</h3>
        <p className="text-sm text-muted-foreground">No leads yet.</p>
      </div>
    );
  }

  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status ?? 'new'] = (acc[l.status ?? 'new'] ?? 0) + 1;
    return acc;
  }, {});

  const funnelData = STATUS_ORDER.map((status) => {
    const count = statusCounts[status] ?? 0;
    const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : '0';
    return { status, count, percentage: parseFloat(percentage) };
  });

  const maxCount = Math.max(...funnelData.map((d) => d.count), 1);

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-6">Conversion Funnel</h3>
      <div className="space-y-3">
        {funnelData.map((item, idx) => {
          const widthPercent = (item.count / maxCount) * 100;
          const statusLabelMap: Record<string, string> = {
            new: 'New Leads',
            contacted: 'Contacted',
            quoted: 'Quoted',
            negotiation: 'Negotiation',
            confirmed: 'Confirmed',
            lost: 'Lost',
          };

          return (
            <div key={item.status} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground capitalize">{statusLabelMap[item.status]}</span>
                <span className="text-sm font-semibold text-primary">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="h-10 rounded-md bg-accent overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 flex items-center px-3"
                  style={{ width: `${widthPercent}%` }}
                >
                  {widthPercent > 15 && (
                    <span className="text-xs font-bold text-primary-foreground">{item.count}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Total leads shown: <span className="font-semibold text-foreground">{totalLeads}</span>
      </p>
    </div>
  );
}

/**
 * Priority Distribution Component
 */
export function PriorityDistribution({ leads }: Pick<AnalyticsChartsProps, 'leads'>) {
  const priorityCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.priority ?? 'low'] = (acc[l.priority ?? 'low'] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 gap-3">
      {PRIORITY_ORDER.map((priority) => {
        const count = priorityCounts[priority] ?? 0;
        return (
          <div
            key={priority}
            className="rounded-lg border border-border bg-card p-4 shadow-brand text-center"
          >
            <p className="text-sm text-muted-foreground mb-2">{PRIORITY_LABELS[priority]} Priority</p>
            <p className="font-heading text-3xl font-semibold" style={{ color: PRIORITY_COLORS[priority] }}>
              {count}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Daily Leads Chart Component
 */
export function DailyLeadsChart({ leads }: Pick<AnalyticsChartsProps, 'leads'>) {
  const dailyData = leads.reduce<Record<string, number>>((acc, lead) => {
    if (!lead.created_at) return acc;
    const date = lead.created_at.slice(0, 10);
    acc[date] = (acc[date] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(dailyData)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      date,
      leads: count,
    }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Daily Leads</h3>
        <p className="text-sm text-muted-foreground">No data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Daily Leads Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--muted-foreground)"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '0.875rem' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Lead Source Breakdown Component
 */
export function LeadSourceChart({ leads }: Pick<AnalyticsChartsProps, 'leads'>) {
  const sourceData = leads.reduce<Record<string, number>>((acc, lead) => {
    const source = lead.source ?? 'unknown';
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});

  // Group minor sources into "Other" if more than 5 sources
  let chartData = Object.entries(sourceData)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  if (chartData.length > 5) {
    const topSources = chartData.slice(0, 5);
    const otherCount = chartData.slice(5).reduce((sum, d) => sum + d.count, 0);
    chartData = [...topSources, { source: 'Other', count: otherCount }];
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Lead Sources</h3>
        <p className="text-sm text-muted-foreground">No data available.</p>
      </div>
    );
  }

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Leads by Source</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="source"
            stroke="var(--muted-foreground)"
            style={{ fontSize: '0.75rem' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '0.875rem' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            cursor={{ fill: 'var(--accent)' }}
          />
          <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
