'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/admin/auth-client';
import { LayoutDashboard, Users, Package, FileText, Star, Image as ImageIcon, Palette, Chrome as HomeIcon, Settings, Globe, MapPin, Tags, ScrollText, LogOut, Navigation, FileCode, Car, PlaneTakeoff, Hotel } from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/activity', label: 'Activity Log', icon: ScrollText },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/leads', label: 'Leads', icon: Users },
      { href: '/admin/packages', label: 'Packages', icon: Package },
      { href: '/admin/blog', label: 'Blogs', icon: FileText },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    label: 'Verticals',
    items: [
      { href: '/admin/vehicles', label: 'Vehicle Rentals', icon: Car },
      { href: '/admin/airport-routes', label: 'Airport Transfers', icon: PlaneTakeoff },
    ],
  },
  {
    label: 'Site',
    items: [
      { href: '/admin/menus', label: 'Navigation Menus', icon: Navigation },
      { href: '/admin/content-pages', label: 'Content Pages', icon: FileCode },
      { href: '/admin/cms-pages', label: 'CMS Pages (Legacy)', icon: FileCode },
      { href: '/admin/homepage-builder', label: 'Homepage Builder', icon: HomeIcon },
      { href: '/admin/theme', label: 'Theme & Branding', icon: Palette },
      { href: '/admin/seo-pages', label: 'SEO Pages', icon: Globe },
      { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
    ],
  },
  {
    label: 'Taxonomies',
    items: [
      { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
      { href: '/admin/categories', label: 'Categories', icon: Tags },
    ],
  },
];

interface SidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="border-b border-border p-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary font-heading text-primary-foreground">D</span>
          <span className="font-heading text-lg font-semibold text-foreground">Divine Travel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition',
                        active ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-accent',
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Signed in as<br/>
          <span className="font-medium text-foreground">{userEmail}</span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-2 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
