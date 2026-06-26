'use client';

import { useState, useEffect } from 'react';
import type { VehiclePricingRow } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface VehiclePricingEditorProps {
  vehicleId: string;
}

const PRICING_TYPES = ['per_km', 'per_day', 'outstation', 'airport', 'hourly', 'flat'];

const EMPTY: Partial<VehiclePricingRow> = {
  pricing_type: 'per_km',
  label: '',
  base_price: 0,
  included_km: null,
  included_hours: null,
  extra_per_km: null,
  extra_per_hour: null,
  is_active: true,
  display_order: 0,
};

export function VehiclePricingEditor({ vehicleId }: VehiclePricingEditorProps) {
  const [rows, setRows] = useState<VehiclePricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<VehiclePricingRow> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/vehicle-pricing?vehicle_id=${vehicleId}`)
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load pricing'))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  const openCreate = () => { setEditing({ ...EMPTY }); setEditingId(null); };
  const openEdit = (row: VehiclePricingRow) => { setEditing({ ...row }); setEditingId(row.id); };
  const cancelEdit = () => { setEditing(null); setEditingId(null); };

  const save = async () => {
    if (!editing?.label?.trim()) { toast.error('Label is required'); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/vehicle-pricing/${editingId}` : '/api/admin/vehicle-pricing';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? editing : { ...editing, vehicle_id: vehicleId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }
      if (editingId) {
        setRows((prev) => prev.map((r) => (r.id === editingId ? data : r)));
        toast.success('Pricing updated');
      } else {
        setRows((prev) => [...prev, data]);
        toast.success('Pricing tier added');
      }
      cancelEdit();
    } catch { toast.error('Network error'); } finally { setSaving(false); }
  };

  const deleteTier = async (id: string) => {
    if (!confirm('Delete this pricing tier?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/vehicle-pricing/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Network error'); } finally { setDeleting(null); }
  };

  if (loading) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading pricing...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">Pricing Tiers</h3>
        {!editing && (
          <Button type="button" variant="outline" size="sm" onClick={openCreate}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Tier
          </Button>
        )}
      </div>

      {rows.length === 0 && !editing && (
        <p className="text-sm text-muted-foreground">No pricing tiers configured yet.</p>
      )}

      {rows.map((row) => (
        <div key={row.id} className={`rounded-md border border-border p-3 ${!row.is_active ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">{row.label}</span>
              <Badge variant="secondary" className="ml-2 text-xs">{row.pricing_type}</Badge>
              {!row.is_active && <Badge variant="outline" className="ml-1 text-xs">Inactive</Badge>}
              <p className="mt-0.5 text-sm text-muted-foreground">
                Base: ₹{row.base_price}
                {row.included_km ? ` · ${row.included_km} km included` : ''}
                {row.extra_per_km ? ` · ₹${row.extra_per_km}/km extra` : ''}
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
                onClick={() => deleteTier(row.id)}
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
          <p className="mb-3 text-sm font-medium text-foreground">{editingId ? 'Edit Tier' : 'New Pricing Tier'}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Label *</Label>
              <Input value={editing.label ?? ''} onChange={(e) => setEditing((p) => ({ ...p, label: e.target.value }))} placeholder="Standard Rate, Outstation Package..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pricing Type</Label>
              <select
                value={editing.pricing_type ?? 'per_km'}
                onChange={(e) => setEditing((p) => ({ ...p, pricing_type: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {PRICING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Base Price (₹) *</Label>
              <Input type="number" min="0" value={editing.base_price ?? 0} onChange={(e) => setEditing((p) => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Included KM</Label>
              <Input type="number" min="0" value={editing.included_km ?? ''} onChange={(e) => setEditing((p) => ({ ...p, included_km: e.target.value ? parseInt(e.target.value) : null }))} placeholder="e.g. 100" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Extra per KM (₹)</Label>
              <Input type="number" min="0" step="0.5" value={editing.extra_per_km ?? ''} onChange={(e) => setEditing((p) => ({ ...p, extra_per_km: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="e.g. 12" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Included Hours</Label>
              <Input type="number" min="0" value={editing.included_hours ?? ''} onChange={(e) => setEditing((p) => ({ ...p, included_hours: e.target.value ? parseInt(e.target.value) : null }))} placeholder="e.g. 8" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Extra per Hour (₹)</Label>
              <Input type="number" min="0" value={editing.extra_per_hour ?? ''} onChange={(e) => setEditing((p) => ({ ...p, extra_per_hour: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="e.g. 100" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Display Order</Label>
              <Input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
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
              {editingId ? 'Save Changes' : 'Add Tier'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
