'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { TariffEntryRow } from '@/types/database';

interface TariffManagerProps {
  initialEntries: TariffEntryRow[];
}

type EntryForm = {
  vehicle: string;
  seats: string;
  price_4h_40km: string;
  price_8h_80km: string;
  extra_per_km: string;
  extra_per_hour: string;
  outstation_price: string;
  driver_bata: string;
  display_order: string;
  is_active: boolean;
};

const EMPTY_FORM: EntryForm = {
  vehicle: '', seats: '', price_4h_40km: '', price_8h_80km: '',
  extra_per_km: '', extra_per_hour: '', outstation_price: '', driver_bata: '',
  display_order: '0', is_active: true,
};

function toPayload(f: EntryForm) {
  return {
    vehicle: f.vehicle,
    seats: f.seats ? Number(f.seats) : null,
    price_4h_40km: f.price_4h_40km ? Number(f.price_4h_40km) : null,
    price_8h_80km: f.price_8h_80km ? Number(f.price_8h_80km) : null,
    extra_per_km: f.extra_per_km ? Number(f.extra_per_km) : null,
    extra_per_hour: f.extra_per_hour ? Number(f.extra_per_hour) : null,
    outstation_price: f.outstation_price ? Number(f.outstation_price) : null,
    driver_bata: f.driver_bata ? Number(f.driver_bata) : null,
    display_order: Number(f.display_order),
    is_active: f.is_active,
  };
}

function toForm(e: TariffEntryRow): EntryForm {
  return {
    vehicle: e.vehicle,
    seats: e.seats != null ? String(e.seats) : '',
    price_4h_40km: e.price_4h_40km != null ? String(e.price_4h_40km) : '',
    price_8h_80km: e.price_8h_80km != null ? String(e.price_8h_80km) : '',
    extra_per_km: e.extra_per_km != null ? String(e.extra_per_km) : '',
    extra_per_hour: e.extra_per_hour != null ? String(e.extra_per_hour) : '',
    outstation_price: e.outstation_price != null ? String(e.outstation_price) : '',
    driver_bata: e.driver_bata != null ? String(e.driver_bata) : '',
    display_order: String(e.display_order),
    is_active: e.is_active,
  };
}

export function TariffManager({ initialEntries }: TariffManagerProps) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TariffEntryRow[]>(initialEntries);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState<EntryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EntryForm | null>(null);

  async function createEntry() {
    if (!newForm.vehicle) return;
    const res = await fetch('/api/admin/tariff-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(newForm)),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const created: TariffEntryRow = await res.json();
    setEntries((prev) => [...prev, created].sort((a, b) => a.display_order - b.display_order));
    setNewForm(EMPTY_FORM);
    setAdding(false);
    toast({ title: 'Entry added' });
  }

  async function updateEntry(id: string) {
    if (!editForm) return;
    const res = await fetch(`/api/admin/tariff-entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(editForm)),
    });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    const updated: TariffEntryRow = await res.json();
    setEntries((prev) => prev.map((e) => e.id === id ? updated : e));
    setEditingId(null);
    toast({ title: 'Entry updated' });
  }

  async function deleteEntry(id: string) {
    if (!confirm('Delete this tariff entry?')) return;
    const res = await fetch(`/api/admin/tariff-entries/${id}`, { method: 'DELETE' });
    if (!res.ok) { toast({ title: 'Error', variant: 'destructive' }); return; }
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: 'Entry deleted' });
  }

  function exportCsv() {
    const header = ['Vehicle', 'Seats', '4H/40KM', '8H/80KM', 'Extra/KM', 'Extra/Hr', 'Outstation', 'Driver Bata', 'Active'];
    const rows = entries.map((e) => [e.vehicle, e.seats ?? '', e.price_4h_40km ?? '', e.price_8h_80km ?? '', e.extra_per_km ?? '', e.extra_per_hour ?? '', e.outstation_price ?? '', e.driver_bata ?? '', e.is_active ? 'Yes' : 'No']);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tariff.csv';
    a.click();
  }

  const fieldCls = 'h-8 text-xs';

  function FormRow({ form, onChange }: { form: EntryForm; onChange: (f: EntryForm) => void }) {
    const s = (key: keyof EntryForm, val: string | boolean) => onChange({ ...form, [key]: val });
    return (
      <tr className="bg-primary/5">
        <td className="px-3 py-2"><Input className={fieldCls} value={form.vehicle} onChange={(e) => s('vehicle', e.target.value)} placeholder="Sedan" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-16')} type="number" value={form.seats} onChange={(e) => s('seats', e.target.value)} placeholder="4" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-24')} type="number" value={form.price_4h_40km} onChange={(e) => s('price_4h_40km', e.target.value)} placeholder="1200" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-24')} type="number" value={form.price_8h_80km} onChange={(e) => s('price_8h_80km', e.target.value)} placeholder="1800" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-20')} type="number" value={form.extra_per_km} onChange={(e) => s('extra_per_km', e.target.value)} placeholder="14" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-20')} type="number" value={form.extra_per_hour} onChange={(e) => s('extra_per_hour', e.target.value)} placeholder="100" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-24')} type="number" value={form.outstation_price} onChange={(e) => s('outstation_price', e.target.value)} placeholder="16" /></td>
        <td className="px-3 py-2"><Input className={cn(fieldCls, 'w-20')} type="number" value={form.driver_bata} onChange={(e) => s('driver_bata', e.target.value)} placeholder="300" /></td>
        <td className="px-3 py-2">
          <Switch checked={form.is_active} onCheckedChange={(v) => s('is_active', v)} />
        </td>
        <td className="px-3 py-2 text-right" />
      </tr>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{entries.length} entries</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setAdding(true)} disabled={adding}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Entry
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/60 border-b border-border">
              <tr>
                {['Vehicle', 'Seats', '4H/40KM', '8H/80KM', 'Extra/KM', 'Extra/Hr', 'Outstation', 'Driver Bata', 'Active', ''].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adding && (
                <FormRow form={newForm} onChange={setNewForm} />
              )}
              {adding && (
                <tr className="bg-primary/5">
                  <td colSpan={10} className="px-3 pb-2">
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs" onClick={createEntry}>Add</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setAdding(false); setNewForm(EMPTY_FORM); }}>Cancel</Button>
                    </div>
                  </td>
                </tr>
              )}

              {entries.map((entry) => (
                <>
                  {editingId === entry.id && editForm ? (
                    <FormRow key={`edit-${entry.id}`} form={editForm} onChange={setEditForm} />
                  ) : (
                    <tr key={entry.id} className={cn('transition-colors hover:bg-muted/40', !entry.is_active && 'opacity-50')}>
                      <td className="px-3 py-2.5 font-medium text-foreground">{entry.vehicle}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{entry.seats ?? '—'}</td>
                      <td className="px-3 py-2.5">{entry.price_4h_40km != null ? `₹${entry.price_4h_40km}` : '—'}</td>
                      <td className="px-3 py-2.5">{entry.price_8h_80km != null ? `₹${entry.price_8h_80km}` : '—'}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{entry.extra_per_km != null ? `₹${entry.extra_per_km}` : '—'}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{entry.extra_per_hour != null ? `₹${entry.extra_per_hour}` : '—'}</td>
                      <td className="px-3 py-2.5">{entry.outstation_price != null ? `₹${entry.outstation_price}` : '—'}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{entry.driver_bata != null ? `₹${entry.driver_bata}` : '—'}</td>
                      <td className="px-3 py-2.5">
                        <Switch checked={entry.is_active} onCheckedChange={async (v) => {
                          const res = await fetch(`/api/admin/tariff-entries/${entry.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...entry, is_active: v }) });
                          if (res.ok) setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, is_active: v } : e));
                        }} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => { setEditingId(entry.id); setEditForm(toForm(entry)); }} className="rounded p-1 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => deleteEntry(entry.id)} className="rounded p-1 text-destructive/60 hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {editingId === entry.id && editForm && (
                    <tr key={`save-${entry.id}`} className="bg-primary/5">
                      <td colSpan={10} className="px-3 pb-2">
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs" onClick={() => updateEntry(entry.id)}>Save</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}

              {entries.length === 0 && !adding && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                    No tariff entries. Click &quot;Add Entry&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
