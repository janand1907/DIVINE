'use client';

import { useState, useEffect } from 'react';
import type { TransferPricingRow, TransferVehicleTypeRow } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader as Loader2, Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface TransferPricingEditorProps {
  routeId: string;
}

type PricingWithVehicle = TransferPricingRow & {
  transfer_vehicle_types?: { name: string; seats: number } | null;
};

const EMPTY: Partial<TransferPricingRow> = {
  base_price: 0,
  return_price: null,
  extra_per_km: null,
  toll_extra: null,
  waiting_charge_per_hour: null,
  night_surcharge: null,
  is_active: true,
  display_order: 0,
};

export function TransferPricingEditor({ routeId }: TransferPricingEditorProps) {
  const [rows, setRows] = useState<PricingWithVehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<TransferVehicleTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TransferPricingRow & { vehicle_type_id: string }> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/transfer-pricing?route_id=${routeId}`).then((r) => r.json()),
      fetch('/api/admin/transfer-vehicle-types').then((r) => r.json()),
    ])
      .then(([pricing, types]) => {
        setRows(Array.isArray(pricing) ? pricing : []);
        setVehicleTypes(Array.isArray(types) ? types : []);
      })
      .catch(() => toast.error('Failed to load pricing'))
      .finally(() => setLoading(false));
  }, [routeId]);

  const openCreate = () => {
    setEditing({ ...EMPTY, vehicle_type_id: vehicleTypes[0]?.id ?? '' });
    setEditingId(null);
  };
  const openEdit = (row: PricingWithVehicle) => { setEditing({ ...row }); setEditingId(row.id); };
  const cancelEdit = () => { setEditing(null); setEditingId(null); };

  const save = async () => {
    if (!editing?.vehicle_type_id) { toast.error('Vehicle type is required'); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/transfer-pricing/${editingId}` : '/api/admin/transfer-pricing';
      const method = editingId ? 'PATCH' : 'POST';
      const payload = editingId
        ? { base_price: editing.base_price, return_price: editing.return_price, extra_per_km: editing.extra_per_km, toll_extra: editing.toll_extra, waiting_charge_per_hour: editing.waiting_charge_per_hour, night_surcharge: editing.night_surcharge, is_active: editing.is_active, display_order: editing.display_order }
        : { ...editing, route_id: routeId };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }

      if (editingId) {
        setRows((prev) => prev.map((r) => (r.id === editingId ? { ...data, transfer_vehicle_types: r.transfer_vehicle_types } : r)));
        toast.success('Pricing updated');
      } else {
        const vt = vehicleTypes.find((v) => v.id === data.vehicle_type_id);
        setRows((prev) => [...prev, { ...data, transfer_vehicle_types: vt ? { name: vt.name, seats: vt.seats } : null }]);
        toast.success('Pricing added');
      }
      cancelEdit();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  const deletePricing = async (id: string) => {
    if (!confirm('Delete this pricing entry?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/transfer-pricing/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Network error'); } finally { setDeleting(null); }
  };

  if (loading) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading pricing...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">Transfer Pricing</h3>
        {!editing && (
          <Button type="button" variant="outline" size="sm" onClick={openCreate} disabled={vehicleTypes.length === 0}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Pricing
          </Button>
        )}
      </div>

      {rows.length === 0 && !editing && (
        <p className="text-sm text-muted-foreground">No pricing configured for this route.</p>
      )}

      {rows.map((row) => (
        <div key={row.id} className={`rounded-md border border-border p-3 ${!row.is_active ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">
                {row.transfer_vehicle_types?.name ?? 'Unknown Vehicle'}
              </span>
              {row.transfer_vehicle_types?.seats && (
                <Badge variant="secondary" className="ml-2 text-xs">{row.transfer_vehicle_types.seats} seats</Badge>
              )}
              {!row.is_active && <Badge variant="outline" className="ml-1 text-xs">Inactive</Badge>}
              <p className="mt-0.5 text-sm text-muted-foreground">
                One-way: ₹{row.base_price}
                {row.return_price ? ` · Return: ₹${row.return_price}` : ''}
                {row.toll_extra ? ` · Toll: ₹${row.toll_extra}` : ''}
              </p>
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => deletePricing(row.id)}
                disabled={deleting === row.id}
              >
                {deleting === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {editing && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">{editingId ? 'Edit Pricing' : 'New Pricing Entry'}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {!editingId && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Vehicle Type *</Label>
                <Select
                  value={editing.vehicle_type_id ?? ''}
                  onValueChange={(v) => setEditing((p) => ({ ...p, vehicle_type_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((vt) => (
                      <SelectItem key={vt.id} value={vt.id}>{vt.name} ({vt.seats} seats)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">One-way Price (₹) *</Label>
              <Input type="number" min="0" value={editing.base_price ?? 0} onChange={(e) => setEditing((p) => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Return Price (₹)</Label>
              <Input type="number" min="0" value={editing.return_price ?? ''} onChange={(e) => setEditing((p) => ({ ...p, return_price: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Leave blank if not available" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Extra per KM (₹)</Label>
              <Input type="number" min="0" step="0.5" value={editing.extra_per_km ?? ''} onChange={(e) => setEditing((p) => ({ ...p, extra_per_km: e.target.value ? parseFloat(e.target.value) : null }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Toll Extra (₹)</Label>
              <Input type="number" min="0" value={editing.toll_extra ?? ''} onChange={(e) => setEditing((p) => ({ ...p, toll_extra: e.target.value ? parseFloat(e.target.value) : null }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Waiting Charge/Hour (₹)</Label>
              <Input type="number" min="0" value={editing.waiting_charge_per_hour ?? ''} onChange={(e) => setEditing((p) => ({ ...p, waiting_charge_per_hour: e.target.value ? parseFloat(e.target.value) : null }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Night Surcharge (₹)</Label>
              <Input type="number" min="0" value={editing.night_surcharge ?? ''} onChange={(e) => setEditing((p) => ({ ...p, night_surcharge: e.target.value ? parseFloat(e.target.value) : null }))} />
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing((p) => ({ ...p, is_active: v }))} />
              <Label className="text-xs">Active</Label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
            <Button type="button" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <DollarSign className="mr-1 h-3.5 w-3.5" />}
              {editingId ? 'Save Changes' : 'Add Pricing'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
