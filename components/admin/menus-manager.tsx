'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight, GripVertical,
  Eye, EyeOff, ExternalLink, Check, X, Sparkles, Globe, Link2,
  Tag, LayoutGrid, Info, Search, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { NavMenuWithItems, NavItemRow, ModuleNavPoolRow } from '@/types/database';

// ─── Types ────────────────────────────────────────────────────

interface MenusManagerProps {
  initial: NavMenuWithItems[];
  poolItems: ModuleNavPoolRow[];
}

interface MenuForm {
  title: string;
  url: string;
  icon: string;
  open_in_new_tab: boolean;
  display_order: number;
  is_active: boolean;
}

interface ItemForm {
  title: string;
  url: string;
  description: string;
  icon: string;
  badge_text: string;
  open_in_new_tab: boolean;
  display_order: number;
  is_active: boolean;
  pool_entity_id: string | null;
}

const EMPTY_MENU: MenuForm = {
  title: '', url: '/', icon: '', open_in_new_tab: false, display_order: 0, is_active: true,
};

const EMPTY_ITEM: ItemForm = {
  title: '', url: '/', description: '', icon: '', badge_text: '',
  open_in_new_tab: false, display_order: 0, is_active: true, pool_entity_id: null,
};

// Group pool items by their module for the pool panel
const MODULE_LABELS: Record<string, string> = {
  tours_divine: 'Divine Tours',
  tours_domestic: 'Domestic Tours',
  tours_international: 'International Tours',
  vehicles: 'Vehicle Rentals',
  transfers: 'Airport Transfers',
};

// ─── Component ────────────────────────────────────────────────

export function MenusManager({ initial, poolItems }: MenusManagerProps) {
  const { toast } = useToast();
  const [menus, setMenus] = useState<NavMenuWithItems[]>(initial);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [poolSearch, setPoolSearch] = useState('');
  const [activePoolTab, setActivePoolTab] = useState<string>('all');

  // Drag state for menus
  const [menuDragIdx, setMenuDragIdx] = useState<number | null>(null);
  const [menuDragOverIdx, setMenuDragOverIdx] = useState<number | null>(null);
  const menuDragRef = useRef<HTMLDivElement | null>(null);

  // Drag state for items within a menu
  const [itemDrag, setItemDrag] = useState<{ menuId: string; idx: number } | null>(null);
  const [itemDragOver, setItemDragOver] = useState<{ menuId: string; idx: number } | null>(null);
  const itemDragRef = useRef<HTMLDivElement | null>(null);

  // Menu CRUD dialog
  const [menuDialog, setMenuDialog] = useState<{ open: boolean; id?: string; form: MenuForm }>({
    open: false, form: EMPTY_MENU,
  });

  // Item CRUD dialog
  const [itemDialog, setItemDialog] = useState<{
    open: boolean; menuId?: string; id?: string; form: ItemForm;
  }>({ open: false, form: EMPTY_ITEM });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean; type: 'menu' | 'item'; id: string; label: string;
  } | null>(null);

  // ─── Data fetch ─────────────────────────────────────────────

  const fetchMenus = useCallback(async () => {
    const res = await fetch('/api/admin/nav-menus');
    if (res.ok) {
      const data: NavMenuWithItems[] = await res.json();
      setMenus(data.map((m) => ({
        ...m,
        nav_items: [...(m.nav_items ?? [])].sort((a, b) => a.display_order - b.display_order),
      })));
    }
  }, []);

  // ─── Menu drag ──────────────────────────────────────────────

  const handleMenuDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    setMenuDragIdx(idx);
    menuDragRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (menuDragRef.current) menuDragRef.current.style.opacity = '0.4'; }, 0);
  };

  const handleMenuDragEnd = () => {
    if (menuDragRef.current) menuDragRef.current.style.opacity = '1';
    setMenuDragIdx(null);
    setMenuDragOverIdx(null);
    menuDragRef.current = null;
  };

  const handleMenuDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    const fromIdx = menuDragIdx;
    if (fromIdx === null || fromIdx === dropIdx) { handleMenuDragEnd(); return; }

    const newMenus = [...menus];
    const [moved] = newMenus.splice(fromIdx, 1);
    newMenus.splice(dropIdx, 0, moved);
    const reordered = newMenus.map((m, i) => ({ ...m, display_order: i }));
    setMenus(reordered);
    handleMenuDragEnd();

    await Promise.all(
      reordered.map((m, i) =>
        fetch(`/api/admin/nav-menus/${m.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: i }),
        }),
      ),
    );
  };

  // ─── Item drag ──────────────────────────────────────────────

  const handleItemDragStart = (e: React.DragEvent<HTMLDivElement>, menuId: string, idx: number) => {
    setItemDrag({ menuId, idx });
    itemDragRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (itemDragRef.current) itemDragRef.current.style.opacity = '0.4'; }, 0);
  };

  const handleItemDragEnd = () => {
    if (itemDragRef.current) itemDragRef.current.style.opacity = '1';
    setItemDrag(null);
    setItemDragOver(null);
    itemDragRef.current = null;
  };

  const handleItemDrop = async (e: React.DragEvent, menuId: string, dropIdx: number) => {
    e.preventDefault();
    if (!itemDrag || itemDrag.menuId !== menuId || itemDrag.idx === dropIdx) {
      handleItemDragEnd(); return;
    }

    setMenus((prev) => prev.map((m) => {
      if (m.id !== menuId) return m;
      const items = [...m.nav_items];
      const [moved] = items.splice(itemDrag.idx, 1);
      items.splice(dropIdx, 0, moved);
      return { ...m, nav_items: items.map((it, i) => ({ ...it, display_order: i })) };
    }));
    handleItemDragEnd();

    const menu = menus.find((m) => m.id === menuId);
    if (!menu) return;
    const items = [...menu.nav_items];
    const [moved] = items.splice(itemDrag.idx, 1);
    items.splice(dropIdx, 0, moved);
    await Promise.all(
      items.map((it, i) =>
        fetch(`/api/admin/nav-items/${it.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: i }),
        }),
      ),
    );
  };

  // ─── Menu CRUD ──────────────────────────────────────────────

  function openNewMenu() {
    setMenuDialog({ open: true, form: { ...EMPTY_MENU, display_order: menus.length } });
  }

  function openEditMenu(menu: NavMenuWithItems) {
    setMenuDialog({
      open: true, id: menu.id,
      form: {
        title: menu.title, url: menu.url, icon: menu.icon ?? '',
        open_in_new_tab: menu.open_in_new_tab, display_order: menu.display_order,
        is_active: menu.is_active,
      },
    });
  }

  async function saveMenu() {
    setLoading(true);
    try {
      const { id, form } = menuDialog;
      const url = id ? `/api/admin/nav-menus/${id}` : '/api/admin/nav-menus';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, icon: form.icon || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: id ? 'Menu updated' : 'Menu created' });
      setMenuDialog({ open: false, form: EMPTY_MENU });
      await fetchMenus();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteMenu(id: string) {
    const res = await fetch(`/api/admin/nav-menus/${id}`, { method: 'DELETE' });
    if (res.ok) { toast({ title: 'Menu deleted' }); await fetchMenus(); }
    setDeleteConfirm(null);
  }

  async function toggleMenuActive(menu: NavMenuWithItems) {
    const res = await fetch(`/api/admin/nav-menus/${menu.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !menu.is_active }),
    });
    if (res.ok) {
      setMenus((prev) => prev.map((m) => m.id === menu.id ? { ...m, is_active: !m.is_active } : m));
    }
  }

  // ─── Item CRUD ──────────────────────────────────────────────

  function openNewItem(menuId: string, itemCount: number) {
    setItemDialog({ open: true, menuId, form: { ...EMPTY_ITEM, display_order: itemCount } });
  }

  function openEditItem(menuId: string, item: NavItemRow) {
    setItemDialog({
      open: true, menuId, id: item.id,
      form: {
        title: item.title, url: item.url, description: item.description ?? '',
        icon: item.icon ?? '', badge_text: item.badge_text ?? '',
        open_in_new_tab: item.open_in_new_tab, display_order: item.display_order,
        is_active: item.is_active, pool_entity_id: item.pool_entity_id ?? null,
      },
    });
  }

  async function saveItem() {
    setLoading(true);
    try {
      const { menuId, id, form } = itemDialog;
      const url = id ? `/api/admin/nav-items/${id}` : '/api/admin/nav-items';
      const method = id ? 'PUT' : 'POST';
      const body = id
        ? { ...form, icon: form.icon || null, badge_text: form.badge_text || null, description: form.description || null }
        : { ...form, menu_id: menuId, icon: form.icon || null, badge_text: form.badge_text || null, description: form.description || null };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: id ? 'Item updated' : 'Item added' });
      setItemDialog({ open: false, form: EMPTY_ITEM });
      await fetchMenus();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/admin/nav-items/${id}`, { method: 'DELETE' });
    if (res.ok) { toast({ title: 'Item removed' }); await fetchMenus(); }
    setDeleteConfirm(null);
  }

  async function toggleItemActive(menuId: string, item: NavItemRow) {
    const res = await fetch(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    if (res.ok) {
      setMenus((prev) => prev.map((m) => m.id === menuId
        ? { ...m, nav_items: m.nav_items.map((it) => it.id === item.id ? { ...it, is_active: !it.is_active } : it) }
        : m,
      ));
    }
  }

  // Add a pool item as a nav item to a menu
  async function addPoolItemToMenu(menuId: string, poolItem: ModuleNavPoolRow, itemCount: number) {
    const body = {
      menu_id: menuId, title: poolItem.label, url: poolItem.url,
      pool_entity_id: poolItem.id,
      badge_text: poolItem.badge_text ?? null,
      display_order: itemCount, is_active: true,
    };
    const res = await fetch('/api/admin/nav-items', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (res.ok) {
      toast({ title: `Added "${poolItem.label}" to menu` });
      await fetchMenus();
    } else {
      toast({ title: 'Error adding item', variant: 'destructive' });
    }
  }

  // ─── Pool panel data ─────────────────────────────────────────

  const groupedPool = poolItems.reduce<Record<string, ModuleNavPoolRow[]>>((acc, item) => {
    const key = item.module ?? 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const poolModules = ['all', ...Object.keys(groupedPool)];

  const filteredPool = poolItems.filter((item) => {
    const matchesModule = activePoolTab === 'all' || item.module === activePoolTab;
    const matchesSearch = !poolSearch || item.label.toLowerCase().includes(poolSearch.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="grid h-full gap-6 lg:grid-cols-[1fr_320px]">

      {/* LEFT — Navigation Tree */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Navigation Menus</h2>
            <p className="text-sm text-muted-foreground">
              {menus.length} top-level {menus.length === 1 ? 'menu' : 'menus'} &mdash; drag to reorder
            </p>
          </div>
          <Button onClick={openNewMenu} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Menu
          </Button>
        </div>

        {menus.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
            <LayoutGrid className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No menus yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">Click &quot;Add Menu&quot; to create your first navigation menu.</p>
            <Button size="sm" className="mt-4" onClick={openNewMenu}>
              <Plus className="mr-2 h-4 w-4" /> Create First Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {menus.map((menu, menuIdx) => {
              const expanded = expandedMenus.has(menu.id);
              const isDragOver = menuDragOverIdx === menuIdx && menuDragIdx !== menuIdx;

              return (
                <div
                  key={menu.id}
                  draggable
                  onDragStart={(e) => handleMenuDragStart(e, menuIdx)}
                  onDragEnd={handleMenuDragEnd}
                  onDragOver={(e) => { e.preventDefault(); setMenuDragOverIdx(menuIdx); }}
                  onDrop={(e) => handleMenuDrop(e, menuIdx)}
                  className={cn(
                    'rounded-xl border border-border bg-card shadow-sm transition-shadow',
                    isDragOver && 'ring-2 ring-primary ring-offset-1',
                    !menu.is_active && 'opacity-60',
                  )}
                >
                  {/* Menu header row */}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />

                    <button
                      type="button"
                      onClick={() => setExpandedMenus((prev) => {
                        const next = new Set(prev);
                        if (next.has(menu.id)) next.delete(menu.id); else next.add(menu.id);
                        return next;
                      })}
                      className="flex flex-1 items-center gap-3 overflow-hidden text-left"
                    >
                      <span className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                        menu.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                      )}>
                        {menu.nav_items.length}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground">{menu.title}</span>
                          {!menu.is_active && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                          {menu.open_in_new_tab && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground/60" aria-label="Opens in new tab" />
                          )}
                        </div>
                        <span className="truncate font-mono text-xs text-muted-foreground">{menu.url}</span>
                      </div>
                      {menu.nav_items.length > 0 && (
                        expanded
                          ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>

                    {/* Menu actions */}
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => toggleMenuActive(menu)}
                        title={menu.is_active ? 'Hide menu' : 'Show menu'}
                      >
                        {menu.is_active
                          ? <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                        }
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openNewItem(menu.id, menu.nav_items.length)} title="Add item">
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditMenu(menu)} title="Edit menu">
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm({ open: true, type: 'menu', id: menu.id, label: menu.title })}
                        title="Delete menu"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Sub-items */}
                  {expanded && (
                    <div className="border-t border-border">
                      {menu.nav_items.length === 0 ? (
                        <div className="flex items-center justify-between px-6 py-4">
                          <span className="text-xs text-muted-foreground">No items. Add items from the pool or manually.</span>
                          <Button size="sm" variant="outline" onClick={() => openNewItem(menu.id, 0)}>
                            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Item
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-px py-1">
                          {menu.nav_items.map((item, itemIdx) => {
                            const isItemDragOver =
                              itemDragOver?.menuId === menu.id &&
                              itemDragOver?.idx === itemIdx &&
                              itemDrag?.idx !== itemIdx;

                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleItemDragStart(e, menu.id, itemIdx)}
                                onDragEnd={handleItemDragEnd}
                                onDragOver={(e) => { e.preventDefault(); setItemDragOver({ menuId: menu.id, idx: itemIdx }); }}
                                onDrop={(e) => handleItemDrop(e, menu.id, itemIdx)}
                                className={cn(
                                  'group flex items-center gap-2 px-3 py-2 mx-2 rounded-lg hover:bg-accent transition-colors',
                                  isItemDragOver && 'ring-2 ring-primary ring-inset',
                                  !item.is_active && 'opacity-50',
                                )}
                              >
                                <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
                                    {item.badge_text && (
                                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                        {item.badge_text}
                                      </span>
                                    )}
                                    {item.open_in_new_tab && (
                                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                                    )}
                                    {item.pool_entity_id && (
                                      <span title="Linked to pool item">
                                        <Link2 className="h-3 w-3 shrink-0 text-primary/60" />
                                      </span>
                                    )}
                                    {!item.is_active && <Badge variant="outline" className="text-[9px] py-0">Hidden</Badge>}
                                  </div>
                                  {item.description && (
                                    <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                                  )}
                                  <span className="font-mono text-[10px] text-muted-foreground/60">{item.url}</span>
                                </div>

                                <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost" size="icon" className="h-7 w-7"
                                    onClick={() => toggleItemActive(menu.id, item)}
                                    title={item.is_active ? 'Hide' : 'Show'}
                                  >
                                    {item.is_active
                                      ? <Eye className="h-3 w-3 text-muted-foreground" />
                                      : <EyeOff className="h-3 w-3 text-muted-foreground" />
                                    }
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditItem(menu.id, item)}>
                                    <Pencil className="h-3 w-3 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => setDeleteConfirm({ open: true, type: 'item', id: item.id, label: item.title })}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                          <div className="px-4 pb-2 pt-1">
                            <Button size="sm" variant="ghost" className="h-7 w-full border border-dashed text-xs text-muted-foreground hover:text-foreground" onClick={() => openNewItem(menu.id, menu.nav_items.length)}>
                              <Plus className="mr-1.5 h-3 w-3" /> Add Item Manually
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT — Available Items Pool */}
      <div className="space-y-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">Available Items</h3>
          <p className="text-xs text-muted-foreground">Click to add to the last expanded menu</p>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={poolSearch}
            onChange={(e) => setPoolSearch(e.target.value)}
            placeholder="Search pool..."
            className="pl-8 text-sm"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-320px)] rounded-xl border border-border bg-card">
          <div className="p-3 space-y-1">
            {/* Module filter tabs */}
            <div className="flex flex-wrap gap-1 pb-2">
              {poolModules.map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setActivePoolTab(mod)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    activePoolTab === mod
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {mod === 'all' ? 'All' : (MODULE_LABELS[mod] ?? mod)}
                </button>
              ))}
            </div>

            <Separator />

            {filteredPool.length === 0 ? (
              <div className="py-8 text-center">
                <Sparkles className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">No items found</p>
              </div>
            ) : (
              filteredPool.map((poolItem) => {
                // Find the last expanded menu to add to
                const targetMenu = Array.from(expandedMenus).reverse().map((id) => menus.find((m) => m.id === id)).find(Boolean);

                return (
                  <div
                    key={poolItem.id}
                    className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-accent transition-colors"
                  >
                    {poolItem.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={poolItem.cover_image}
                        alt={poolItem.label}
                        className="h-8 w-8 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground/60" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{poolItem.label}</p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground/60">
                        {MODULE_LABELS[poolItem.module] ?? poolItem.module}
                      </p>
                    </div>
                    {poolItem.badge_text && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {poolItem.badge_text}
                      </span>
                    )}
                    {targetMenu && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={`Add to "${targetMenu.title}"`}
                        onClick={() => addPoolItemToMenu(targetMenu.id, poolItem, targetMenu.nav_items.length)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {!targetMenu && (
                      <span title="Expand a menu first to add items">
                        <Info className="h-3 w-3 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100" />
                      </span>
                    )}
                  </div>
                );
              })
            )}

            {/* Manual items section */}
            <Separator className="my-2" />
            <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">Manual Items</p>
            {[
              { label: 'Home', url: '/' },
              { label: 'About Us', url: '/about' },
              { label: 'Contact', url: '/contact' },
              { label: 'Blog', url: '/blog' },
              { label: 'Gallery', url: '/gallery' },
              { label: 'FAQ', url: '/faq' },
              { label: 'Testimonials', url: '/testimonials' },
              { label: 'Hotel Assistance', url: '/hotel-assistance' },
              { label: 'Packages', url: '/packages' },
              { label: 'Divine Tours', url: '/divine-tours' },
              { label: 'Domestic Tours', url: '/domestic-tours' },
              { label: 'International Tours', url: '/international-tours' },
              { label: 'Vehicle Rentals', url: '/vehicle-rentals' },
              { label: 'Airport Transfers', url: '/airport-transfers' },
            ].map((manual) => {
              const targetMenu = Array.from(expandedMenus).reverse().map((id) => menus.find((m) => m.id === id)).find(Boolean);
              return (
                <div key={manual.url} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
                    <Globe className="h-3 w-3 text-muted-foreground/60" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{manual.label}</p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground/60">{manual.url}</p>
                  </div>
                  {targetMenu && (
                    <Button
                      variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={`Add to "${targetMenu.title}"`}
                      onClick={async () => {
                        const body = {
                          menu_id: targetMenu.id, title: manual.label, url: manual.url,
                          display_order: targetMenu.nav_items.length, is_active: true,
                        };
                        const res = await fetch('/api/admin/nav-items', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
                        });
                        if (res.ok) { toast({ title: `Added "${manual.label}"` }); await fetchMenus(); }
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* ─── Menu Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={menuDialog.open}
        onOpenChange={(open) => !open && setMenuDialog({ open: false, form: EMPTY_MENU })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{menuDialog.id ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
            <DialogDescription>
              Top-level navigation menus appear in the main header.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="m-title">Menu Title <span className="text-destructive">*</span></Label>
              <Input
                id="m-title"
                value={menuDialog.form.title}
                onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, title: e.target.value } }))}
                placeholder="e.g. Divine Tours"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="m-url">URL</Label>
              <Input
                id="m-url"
                value={menuDialog.form.url}
                onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, url: e.target.value } }))}
                placeholder="/divine-tours"
              />
              <p className="text-xs text-muted-foreground">The page this menu links to (also used to load mega-menu pool items)</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="m-icon">Icon (optional)</Label>
              <Input
                id="m-icon"
                value={menuDialog.form.icon}
                onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, icon: e.target.value } }))}
                placeholder="e.g. sparkles (Lucide icon name)"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={menuDialog.form.open_in_new_tab}
                onCheckedChange={(v) => setMenuDialog((d) => ({ ...d, form: { ...d.form, open_in_new_tab: v } }))}
                id="m-newtab"
              />
              <Label htmlFor="m-newtab" className="flex items-center gap-1.5 cursor-pointer">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> Open in new tab
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={menuDialog.form.is_active}
                onCheckedChange={(v) => setMenuDialog((d) => ({ ...d, form: { ...d.form, is_active: v } }))}
                id="m-active"
              />
              <Label htmlFor="m-active" className="cursor-pointer">Visible in navigation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenuDialog({ open: false, form: EMPTY_MENU })}>Cancel</Button>
            <Button onClick={saveMenu} disabled={loading || !menuDialog.form.title.trim()}>
              {loading ? 'Saving…' : menuDialog.id ? 'Save Changes' : 'Create Menu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Item Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={itemDialog.open}
        onOpenChange={(open) => !open && setItemDialog({ open: false, form: EMPTY_ITEM })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{itemDialog.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              Items appear in the dropdown or mega-menu for the parent menu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="i-title">Label <span className="text-destructive">*</span></Label>
              <Input
                id="i-title"
                value={itemDialog.form.title}
                onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, title: e.target.value } }))}
                placeholder="e.g. Tirupati"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-url">URL <span className="text-destructive">*</span></Label>
              <Input
                id="i-url"
                value={itemDialog.form.url}
                onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, url: e.target.value } }))}
                placeholder="/divine-tours/tirupati"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-desc">Description</Label>
              <Input
                id="i-desc"
                value={itemDialog.form.description}
                onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, description: e.target.value } }))}
                placeholder="Short description shown in dropdown"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="i-badge" className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Badge
                </Label>
                <Input
                  id="i-badge"
                  value={itemDialog.form.badge_text}
                  onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, badge_text: e.target.value } }))}
                  placeholder="New, Popular, Hot…"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="i-icon">Icon</Label>
                <Input
                  id="i-icon"
                  value={itemDialog.form.icon}
                  onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, icon: e.target.value } }))}
                  placeholder="Lucide icon name"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={itemDialog.form.open_in_new_tab}
                onCheckedChange={(v) => setItemDialog((d) => ({ ...d, form: { ...d.form, open_in_new_tab: v } }))}
                id="i-newtab"
              />
              <Label htmlFor="i-newtab" className="flex items-center gap-1.5 cursor-pointer">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> Open in new tab
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={itemDialog.form.is_active}
                onCheckedChange={(v) => setItemDialog((d) => ({ ...d, form: { ...d.form, is_active: v } }))}
                id="i-active"
              />
              <Label htmlFor="i-active" className="cursor-pointer">Visible in navigation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog({ open: false, form: EMPTY_ITEM })}>Cancel</Button>
            <Button onClick={saveItem} disabled={loading || !itemDialog.form.title.trim() || !itemDialog.form.url.trim()}>
              {loading ? 'Saving…' : itemDialog.id ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────────── */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {deleteConfirm?.type === 'menu' ? 'Menu' : 'Item'}?</DialogTitle>
            <DialogDescription>
              {deleteConfirm?.type === 'menu'
                ? `"${deleteConfirm?.label}" and all its items will be permanently deleted.`
                : `"${deleteConfirm?.label}" will be removed from the navigation.`
              }
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteConfirm) return;
                if (deleteConfirm.type === 'menu') deleteMenu(deleteConfirm.id);
                else deleteItem(deleteConfirm.id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
