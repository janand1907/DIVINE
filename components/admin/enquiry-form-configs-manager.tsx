'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, X, Trash2, Loader as Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import type { EnquiryFormConfigRow, EnquiryFieldConfig } from '@/types/database';

interface EnquiryFormConfigsManagerProps {
  items: EnquiryFormConfigRow[];
}

type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

interface FormState {
  form_key: string;
  title: string;
  description: string;
  submit_label: string;
  success_message: string;
  lead_source: string;
  lead_priority: LeadPriority;
  module: string;
  notify_email: string;
  whatsapp_template: string;
  fields: EnquiryFieldConfig[];
  is_active: boolean;
  display_order: number;
}

const EMPTY_FIELD: EnquiryFieldConfig = {
  key: '',
  label: '',
  type: 'text',
  required: false,
  placeholder: '',
  options: [],
};

const EMPTY_FORM: FormState = {
  form_key: '',
  title: '',
  description: '',
  submit_label: 'Submit Enquiry',
  success_message: 'Thank you for your enquiry!',
  lead_source: 'contact',
  lead_priority: 'medium',
  module: '',
  notify_email: '',
  whatsapp_template: '',
  fields: [],
  is_active: true,
  display_order: 0,
};

const PRIORITY_COLORS: Record<LeadPriority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export function EnquiryFormConfigsManager({ items }: EnquiryFormConfigsManagerProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const reset = () => setForm(EMPTY_FORM);

  const submit = async (e: React.FormEvent, id: string | null) => {
    e.preventDefault();
    setSubmitting(true);
    const url = id ? `/api/admin/enquiry-form-configs/${id}` : '/api/admin/enquiry-form-configs';
    const method = id ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(j?.error ?? 'Failed to save', {
          description: j?.issues ? JSON.stringify(j.issues).slice(0, 200) : undefined,
        });
        setSubmitting(false);
        return;
      }
      toast.success(id ? 'Form config updated' : 'Form config created');
      reset();
      setShowCreate(false);
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  const editRow = (d: EnquiryFormConfigRow) => {
    setEditingId(editingId === d.id ? null : d.id);
    setForm({
      form_key: d.form_key,
      title: d.title,
      description: d.description ?? '',
      submit_label: d.submit_label,
      success_message: d.success_message,
      lead_source: d.lead_source,
      lead_priority: d.lead_priority,
      module: d.module ?? '',
      notify_email: d.notify_email ?? '',
      whatsapp_template: d.whatsapp_template ?? '',
      fields: d.fields ?? [],
      is_active: d.is_active,
      display_order: (d as unknown as { display_order?: number }).display_order ?? 0,
    });
  };

  const onDelete = async (d: EnquiryFormConfigRow) => {
    if (!window.confirm(`Delete "${d.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/enquiry-form-configs/${d.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Form config deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
  };

  const handleAddField = () => {
    const newField = { ...EMPTY_FIELD, key: `field-${Date.now()}` };
    setForm((f) => ({ ...f, fields: [...f.fields, newField] }));
  };

  const handleRemoveField = (index: number) => {
    setForm((f) => ({ ...f, fields: f.fields.filter((_, i) => i !== index) }));
  };

  const handleFieldChange = (index: number, key: string, value: unknown) => {
    setForm((f) => {
      const newFields = [...f.fields];
      (newFields[index] as unknown as Record<string, unknown>)[key] = value;
      return { ...f, fields: newFields };
    });
  };

  const renderFormSheet = (id: string | null, onClose: () => void) => (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{id ? 'Edit Form Config' : 'New Form Config'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={(e) => submit(e, id)} className="space-y-6 py-6">
          {/* Basic Info Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h3 className="text-sm font-semibold">Basic Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="form_key">Form Key *</Label>
                <Input
                  id="form_key"
                  value={form.form_key}
                  onChange={(e) => setForm((f) => ({ ...f, form_key: e.target.value }))}
                  disabled={!!id}
                  placeholder="contact_form"
                  required
                />
                {id && <p className="text-xs text-muted-foreground">Cannot change form key</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Contact Us Form"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>
          </div>

          {/* Form Behavior Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h3 className="text-sm font-semibold">Form Behavior</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="submit_label">Submit Button Label *</Label>
                <Input
                  id="submit_label"
                  value={form.submit_label}
                  onChange={(e) => setForm((f) => ({ ...f, submit_label: e.target.value }))}
                  placeholder="Submit Enquiry"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={0}
                  value={String(form.display_order)}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="success_message">Success Message *</Label>
              <Textarea
                id="success_message"
                rows={2}
                value={form.success_message}
                onChange={(e) => setForm((f) => ({ ...f, success_message: e.target.value }))}
                placeholder="Thank you for your enquiry!"
                required
              />
            </div>
          </div>

          {/* Lead Configuration Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <h3 className="text-sm font-semibold">Lead Configuration</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead_source">Lead Source *</Label>
                <Input
                  id="lead_source"
                  value={form.lead_source}
                  onChange={(e) => setForm((f) => ({ ...f, lead_source: e.target.value }))}
                  placeholder="contact"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead_priority">Lead Priority *</Label>
                <Select value={form.lead_priority} onValueChange={(v) => setForm((f) => ({ ...f, lead_priority: v as LeadPriority }))}>
                  <SelectTrigger id="lead_priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="module">Module</Label>
                <Input
                  id="module"
                  value={form.module}
                  onChange={(e) => setForm((f) => ({ ...f, module: e.target.value }))}
                  placeholder="Optional module name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notify_email">Notification Email</Label>
                <Input
                  id="notify_email"
                  type="email"
                  value={form.notify_email}
                  onChange={(e) => setForm((f) => ({ ...f, notify_email: e.target.value }))}
                  placeholder="notify@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp_template">WhatsApp Template</Label>
              <Input
                id="whatsapp_template"
                value={form.whatsapp_template}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp_template: e.target.value }))}
                placeholder="Optional template ID"
              />
            </div>
          </div>

          {/* Fields Editor Section */}
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Form Fields</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddField}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {form.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-4">No fields yet. Add one to get started.</p>
              ) : (
                form.fields.map((field, index) => (
                  <div key={index} className="rounded-lg border border-border bg-accent/30 p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span>Field {index + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveField(index)}
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor={`field-key-${index}`} className="text-xs">Key *</Label>
                        <Input
                          id={`field-key-${index}`}
                          value={field.key}
                          onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                          placeholder="field_name"
                          required
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`field-label-${index}`} className="text-xs">Label *</Label>
                        <Input
                          id={`field-label-${index}`}
                          value={field.label}
                          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                          placeholder="Field Label"
                          required
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor={`field-type-${index}`} className="text-xs">Type *</Label>
                        <Select
                          value={field.type}
                          onValueChange={(v) => handleFieldChange(index, 'type', v)}
                        >
                          <SelectTrigger id={`field-type-${index}`} className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Tel</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                            className="h-4 w-4 rounded border-border"
                          />
                          <span className="text-xs font-medium">Required</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`field-placeholder-${index}`} className="text-xs">Placeholder</Label>
                      <Input
                        id={`field-placeholder-${index}`}
                        value={field.placeholder || ''}
                        onChange={(e) => handleFieldChange(index, 'placeholder', e.target.value)}
                        placeholder="Enter placeholder text"
                        className="text-xs"
                      />
                    </div>

                    {field.type === 'select' && (
                      <div className="space-y-1.5 bg-muted/50 p-2 rounded">
                        <Label htmlFor={`field-options-${index}`} className="text-xs font-medium">Select Options (comma-separated)</Label>
                        <textarea
                          id={`field-options-${index}`}
                          value={(field.options || []).join('\n')}
                          onChange={(e) => {
                            const opts = e.target.value.split('\n').filter((s) => s.trim());
                            handleFieldChange(index, 'options', opts);
                          }}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          className="text-xs w-full rounded border border-border bg-background p-2"
                          rows={3}
                        />
                      </div>
                    )}

                    {['number', 'text'].includes(field.type) && (
                      <div className="grid gap-3 sm:grid-cols-2 bg-muted/50 p-2 rounded">
                        <div className="space-y-1.5">
                          <Label htmlFor={`field-min-${index}`} className="text-xs">Min</Label>
                          <Input
                            id={`field-min-${index}`}
                            type="number"
                            value={field.min ? String(field.min) : ''}
                            onChange={(e) => handleFieldChange(index, 'min', e.target.value ? Number(e.target.value) : undefined)}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`field-max-${index}`} className="text-xs">Max</Label>
                          <Input
                            id={`field-max-${index}`}
                            type="number"
                            value={field.max ? String(field.max) : ''}
                            onChange={(e) => handleFieldChange(index, 'max', e.target.value ? Number(e.target.value) : undefined)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Enquiry Form Configs</h2>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Button onClick={() => { setShowCreate(true); reset(); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Config
        </Button>
      </div>

      {showCreate && renderFormSheet(null, () => setShowCreate(false))}

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Key</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Lead Source</TableHead>
              <TableHead className="hidden lg:table-cell">Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No form configs yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.form_key}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {item.lead_source}
                  </TableCell>
                  <TableCell className="hidden text-xs lg:table-cell">
                    <Badge className={`capitalize ${PRIORITY_COLORS[item.lead_priority]}`}>
                      {item.lead_priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => editRow(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingId && renderFormSheet(editingId, () => setEditingId(null))}
    </div>
  );
}
