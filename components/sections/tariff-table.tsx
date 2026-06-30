'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TariffEntryRow } from '@/types/database';

interface TariffTableProps {
  entries: TariffEntryRow[];
  title?: string;
  showExport?: boolean;
}

type SortKey = keyof Pick<TariffEntryRow, 'vehicle' | 'seats' | 'price_4h_40km' | 'price_8h_80km' | 'outstation_price'>;

function fmt(val: number | null): string {
  if (val == null) return '—';
  return `₹${val.toLocaleString('en-IN')}`;
}

export function TariffTable({ entries, title = 'Transfer Tariff', showExport = true }: TariffTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('vehicle');
  const [sortAsc, setSortAsc] = useState(true);

  const active = entries.filter((e) => e.is_active);

  const sorted = [...active].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortAsc ? av - bv : bv - av;
    }
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  function exportCsv() {
    const header = ['Vehicle', 'Seats', '4H/40KM', '8H/80KM', 'Extra/KM', 'Extra/Hr', 'Outstation', 'Driver Bata'];
    const rows = sorted.map((e) => [
      e.vehicle,
      e.seats ?? '',
      e.price_4h_40km ?? '',
      e.price_8h_80km ?? '',
      e.extra_per_km ?? '',
      e.extra_per_hour ?? '',
      e.outstation_price ?? '',
      e.driver_bata ?? '',
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tariff.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (active.length === 0) return null;

  const cols: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
    { key: 'vehicle', label: 'Vehicle', align: 'left' },
    { key: 'seats', label: 'Seats', align: 'right' },
    { key: 'price_4h_40km', label: '4 Hrs / 40 KM', align: 'right' },
    { key: 'price_8h_80km', label: '8 Hrs / 80 KM', align: 'right' },
  ];

  return (
    <section className="section-py bg-background">
      <div className="container-brand">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Pricing</span>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
          </div>
          {showExport && (
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 border-b border-border bg-muted/60 backdrop-blur-sm">
                <tr>
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        'cursor-pointer select-none whitespace-nowrap px-4 py-3 font-semibold text-foreground transition-colors hover:text-primary',
                        col.align === 'right' ? 'text-right' : 'text-left',
                      )}
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="ml-1 text-primary">{sortAsc ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-foreground">Extra/KM</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-foreground">Extra/Hr</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-foreground">Outstation</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-foreground">Driver Bata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={cn(
                      'transition-colors hover:bg-primary/5',
                      idx % 2 === 0 ? 'bg-white' : 'bg-muted/20',
                    )}
                  >
                    <td className="px-4 py-3.5 font-medium text-foreground">{entry.vehicle}</td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground">{entry.seats ?? '—'}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">{fmt(entry.price_4h_40km)}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">{fmt(entry.price_8h_80km)}</td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground">{fmt(entry.extra_per_km)}</td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground">{fmt(entry.extra_per_hour)}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">{fmt(entry.outstation_price)}</td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground">{fmt(entry.driver_bata)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Prices are indicative. Final pricing depends on route and vehicle availability. GST extra.
        </p>
      </div>
    </section>
  );
}
