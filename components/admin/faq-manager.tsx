'use client';

import { useState } from 'react';
import type { FaqRow, FaqCategoryRow } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader as Loader2, Plus, Pencil, Trash2, CircleHelp as HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FaqManagerProps {
  initialFaqs: FaqRow[];
  initialCategories: FaqCategoryRow[];
}

const EMPTY_FAQ: Partial<FaqRow> = {
  question: '',
  answer: '',
  category_id: null,
  display_order: 0,
  is_published: true,
};

const EMPTY_CAT: Partial<FaqCategoryRow> = {
  name: '',
  display_order: 0,
  is_published: true,
};

export function FaqManager({ initialFaqs, initialCategories }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs);
  const [categories, setCategories] = useState<FaqCategoryRow[]>(initialCategories);
  const [faqSheet, setFaqSheet] = useState(false);
  const [catSheet, setCatSheet] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqRow>>(EMPTY_FAQ);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<FaqCategoryRow>>(EMPTY_CAT);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);
  const [savingCat, setSavingCat] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const openCreateFaq = () => { setEditingFaq({ ...EMPTY_FAQ }); setEditingFaqId(null); setFaqSheet(true); };
  const openEditFaq = (faq: FaqRow) => { setEditingFaq({ ...faq }); setEditingFaqId(faq.id); setFaqSheet(true); };
  const openCreateCat = () => { setEditingCat({ ...EMPTY_CAT }); setEditingCatId(null); setCatSheet(true); };
  const openEditCat = (cat: FaqCategoryRow) => { setEditingCat({ ...cat }); setEditingCatId(cat.id); setCatSheet(true); };

  const saveFaq = async () => {
    if (!editingFaq.question?.trim() || !editingFaq.answer?.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    setSavingFaq(true);
    try {
      const url = editingFaqId ? `/api/admin/faqs/${editingFaqId}` : '/api/admin/faqs';
      const method = editingFaqId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: editingFaq.question,
          answer: editingFaq.answer,
          category_id: editingFaq.category_id || null,
          display_order: editingFaq.display_order ?? 0,
          is_published: editingFaq.is_published ?? true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }
      if (editingFaqId) {
        setFaqs((prev) => prev.map((f) => (f.id === editingFaqId ? data : f)));
        toast.success('FAQ updated');
      } else {
        setFaqs((prev) => [...prev, data]);
        toast.success('FAQ created');
      }
      setFaqSheet(false);
    } catch { toast.error('Network error'); } finally { setSavingFaq(false); }
  };

  const saveCat = async () => {
    if (!editingCat.name?.trim()) { toast.error('Category name is required'); return; }
    setSavingCat(true);
    try {
      const url = editingCatId ? `/api/admin/faq-categories/${editingCatId}` : '/api/admin/faq-categories';
      const method = editingCatId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCat.name,
          display_order: editingCat.display_order ?? 0,
          is_published: editingCat.is_published ?? true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Save failed'); return; }
      if (editingCatId) {
        setCategories((prev) => prev.map((c) => (c.id === editingCatId ? data : c)));
        toast.success('Category updated');
      } else {
        setCategories((prev) => [...prev, data]);
        toast.success('Category created');
      }
      setCatSheet(false);
    } catch { toast.error('Network error'); } finally { setSavingCat(false); }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Network error'); } finally { setDeleting(null); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm('Delete this category? FAQs in this category will become uncategorised.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/faq-categories/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Delete failed'); return; }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Network error'); } finally { setDeleting(null); }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch = !filter || f.question.toLowerCase().includes(filter.toLowerCase()) || f.answer.toLowerCase().includes(filter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || (categoryFilter === 'uncategorised' ? !f.category_id : f.category_id === categoryFilter);
    return matchesSearch && matchesCat;
  });

  const getCatName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised';

  return (
    <>
      <Tabs defaultValue="faqs">
        <TabsList>
          <TabsTrigger value="faqs">FAQs ({faqs.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search FAQs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-56"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="uncategorised">Uncategorised</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openCreateFaq}>
              <Plus className="mr-2 h-4 w-4" /> Add FAQ
            </Button>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <HelpCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No FAQs found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{faq.question}</p>
                        {!faq.is_published && <Badge variant="secondary">Draft</Badge>}
                        {faq.category_id && (
                          <Badge variant="outline" className="text-xs">{getCatName(faq.category_id)}</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditFaq(faq)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteFaq(faq.id)}
                        disabled={deleting === faq.id}
                      >
                        {deleting === faq.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateCat}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
          {categories.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {faqs.filter((f) => f.category_id === cat.id).length} FAQ(s)
                      {!cat.is_published && ' · Draft'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditCat(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteCat(cat.id)}
                      disabled={deleting === cat.id}
                    >
                      {deleting === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* FAQ Sheet */}
      <Sheet open={faqSheet} onOpenChange={setFaqSheet}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingFaqId ? 'Edit FAQ' : 'Add FAQ'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Question *</Label>
              <Input
                value={editingFaq.question ?? ''}
                onChange={(e) => setEditingFaq((p) => ({ ...p, question: e.target.value }))}
                placeholder="What is your cancellation policy?"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer *</Label>
              <Textarea
                rows={5}
                value={editingFaq.answer ?? ''}
                onChange={(e) => setEditingFaq((p) => ({ ...p, answer: e.target.value }))}
                placeholder="We offer full refunds..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={editingFaq.category_id ?? 'none'}
                onValueChange={(v) => setEditingFaq((p) => ({ ...p, category_id: v === 'none' ? null : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorised</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editingFaq.display_order ?? 0}
                  onChange={(e) => setEditingFaq((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-end gap-2 pb-0.5">
                <Switch
                  checked={editingFaq.is_published ?? true}
                  onCheckedChange={(v) => setEditingFaq((p) => ({ ...p, is_published: v }))}
                />
                <Label>Published</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setFaqSheet(false)}>Cancel</Button>
              <Button onClick={saveFaq} disabled={savingFaq}>
                {savingFaq ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingFaqId ? 'Save Changes' : 'Create FAQ'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Category Sheet */}
      <Sheet open={catSheet} onOpenChange={setCatSheet}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingCatId ? 'Edit Category' : 'Add Category'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Category Name *</Label>
              <Input
                value={editingCat.name ?? ''}
                onChange={(e) => setEditingCat((p) => ({ ...p, name: e.target.value }))}
                placeholder="Booking & Payments"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editingCat.display_order ?? 0}
                  onChange={(e) => setEditingCat((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-end gap-2 pb-0.5">
                <Switch
                  checked={editingCat.is_published ?? true}
                  onCheckedChange={(v) => setEditingCat((p) => ({ ...p, is_published: v }))}
                />
                <Label>Published</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setCatSheet(false)}>Cancel</Button>
              <Button onClick={saveCat} disabled={savingCat}>
                {savingCat ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingCatId ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
