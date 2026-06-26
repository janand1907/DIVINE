'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Check, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { NavMenuWithItems, NavItemRow } from '@/types/database';

interface MenusManagerProps {
  initial: NavMenuWithItems[];
}

interface MenuForm {
  title: string;
  url: string;
  display_order: number;
  is_active: boolean;
}

interface ItemForm {
  title: string;
  url: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_MENU: MenuForm = { title: '', url: '/', display_order: 0, is_active: true };
const EMPTY_ITEM: ItemForm = { title: '', url: '/', description: '', display_order: 0, is_active: true };

export function MenusManager({ initial }: MenusManagerProps) {
  const { toast } = useToast();
  const [menus, setMenus] = useState<NavMenuWithItems[]>(initial);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Menu dialog
  const [menuDialog, setMenuDialog] = useState<{ open: boolean; id?: string; form: MenuForm }>({ open: false, form: EMPTY_MENU });

  // Item dialog
  const [itemDialog, setItemDialog] = useState<{ open: boolean; menuId?: string; id?: string; form: ItemForm }>({ open: false, form: EMPTY_ITEM });

  async function fetchMenus() {
    const res = await fetch('/api/admin/nav-menus');
    if (res.ok) setMenus(await res.json());
  }

  function openNewMenu() {
    setMenuDialog({ open: true, form: { ...EMPTY_MENU, display_order: menus.length } });
  }

  function openEditMenu(menu: NavMenuWithItems) {
    setMenuDialog({ open: true, id: menu.id, form: { title: menu.title, url: menu.url, display_order: menu.display_order, is_active: menu.is_active } });
  }

  async function saveMenu() {
    setLoading(true);
    try {
      const { id, form } = menuDialog;
      const url = id ? `/api/admin/nav-menus/${id}` : '/api/admin/nav-menus';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
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
    if (!confirm('Delete this menu and all its items?')) return;
    const res = await fetch(`/api/admin/nav-menus/${id}`, { method: 'DELETE' });
    if (res.ok) { toast({ title: 'Deleted' }); await fetchMenus(); }
  }

  function openNewItem(menuId: string, itemCount: number) {
    setItemDialog({ open: true, menuId, form: { ...EMPTY_ITEM, display_order: itemCount } });
  }

  function openEditItem(menuId: string, item: NavItemRow) {
    setItemDialog({ open: true, menuId, id: item.id, form: { title: item.title, url: item.url, description: item.description ?? '', display_order: item.display_order, is_active: item.is_active } });
  }

  async function saveItem() {
    setLoading(true);
    try {
      const { menuId, id, form } = itemDialog;
      const url = id ? `/api/admin/nav-items/${id}` : '/api/admin/nav-items';
      const method = id ? 'PUT' : 'POST';
      const body = id ? form : { ...form, menu_id: menuId };
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
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/admin/nav-items/${id}`, { method: 'DELETE' });
    if (res.ok) { toast({ title: 'Deleted' }); await fetchMenus(); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Navigation Menus</h2>
          <p className="text-sm text-muted-foreground">{menus.length} top-level menus</p>
        </div>
        <Button onClick={openNewMenu}>
          <Plus className="mr-2 h-4 w-4" /> Add Menu
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-brand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No menus yet. Click &quot;Add Menu&quot; to create one.
                </TableCell>
              </TableRow>
            ) : menus.map((menu) => (
              <>
                <TableRow key={menu.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{menu.title}</TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{menu.url}</TableCell>
                  <TableCell className="text-sm">{menu.display_order}</TableCell>
                  <TableCell>
                    {menu.is_active ? <Badge>Active</Badge> : <Badge variant="outline">Hidden</Badge>}
                  </TableCell>
                  <TableCell>
                    {menu.nav_items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedMenu(expandedMenu === menu.id ? null : menu.id)}
                        className="gap-1 text-xs"
                      >
                        {menu.nav_items.length} items
                        {expandedMenu === menu.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    )}
                    {menu.nav_items.length === 0 && <span className="text-xs text-muted-foreground">0 items</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openNewItem(menu.id, menu.nav_items.length)} aria-label="Add item">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditMenu(menu)} aria-label="Edit menu">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMenu(menu.id)} className="text-destructive hover:text-destructive" aria-label="Delete menu">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {expandedMenu === menu.id && menu.nav_items.map((item) => (
                  <TableRow key={item.id} className="bg-muted/30">
                    <TableCell></TableCell>
                    <TableCell className="pl-8 text-sm text-muted-foreground">
                      <span className="mr-2 text-muted-foreground/40">└</span>
                      {item.title}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{item.url}</TableCell>
                    <TableCell className="text-sm">{item.display_order}</TableCell>
                    <TableCell>
                      {item.is_active ? <Badge variant="secondary">Active</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditItem(menu.id, item)} aria-label="Edit item">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive hover:text-destructive" aria-label="Delete item">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Menu dialog */}
      <Dialog open={menuDialog.open} onOpenChange={(open) => !open && setMenuDialog({ open: false, form: EMPTY_MENU })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{menuDialog.id ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="m-title">Title</Label>
              <Input id="m-title" value={menuDialog.form.title} onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, title: e.target.value } }))} placeholder="e.g. Divine Tours" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="m-url">URL</Label>
              <Input id="m-url" value={menuDialog.form.url} onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, url: e.target.value } }))} placeholder="/divine-tours" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="m-order">Display Order</Label>
              <Input id="m-order" type="number" value={menuDialog.form.display_order} onChange={(e) => setMenuDialog((d) => ({ ...d, form: { ...d.form, display_order: Number(e.target.value) } }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={menuDialog.form.is_active} onCheckedChange={(v) => setMenuDialog((d) => ({ ...d, form: { ...d.form, is_active: v } }))} id="m-active" />
              <Label htmlFor="m-active">Active (visible in nav)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenuDialog({ open: false, form: EMPTY_MENU })}>Cancel</Button>
            <Button onClick={saveMenu} disabled={loading || !menuDialog.form.title.trim()}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item dialog */}
      <Dialog open={itemDialog.open} onOpenChange={(open) => !open && setItemDialog({ open: false, form: EMPTY_ITEM })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{itemDialog.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="i-title">Title</Label>
              <Input id="i-title" value={itemDialog.form.title} onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, title: e.target.value } }))} placeholder="e.g. Tirupati Tours" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-url">URL</Label>
              <Input id="i-url" value={itemDialog.form.url} onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, url: e.target.value } }))} placeholder="/divine-tours/tirupati" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-desc">Description (optional)</Label>
              <Input id="i-desc" value={itemDialog.form.description} onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, description: e.target.value } }))} placeholder="Short description shown in dropdown" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-order">Display Order</Label>
              <Input id="i-order" type="number" value={itemDialog.form.display_order} onChange={(e) => setItemDialog((d) => ({ ...d, form: { ...d.form, display_order: Number(e.target.value) } }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={itemDialog.form.is_active} onCheckedChange={(v) => setItemDialog((d) => ({ ...d, form: { ...d.form, is_active: v } }))} id="i-active" />
              <Label htmlFor="i-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog({ open: false, form: EMPTY_ITEM })}>Cancel</Button>
            <Button onClick={saveItem} disabled={loading || !itemDialog.form.title.trim() || !itemDialog.form.url.trim()}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
