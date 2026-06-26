'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBranding } from '@/lib/theme/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { NavMenuWithItems } from '@/types/database';
import type { PoolItem } from '@/lib/nav/fetch';

// Maps nav menu URLs to their module key in the nav pool
const URL_TO_MODULE: Record<string, string> = {
  '/divine-tours': 'tours_divine',
  '/domestic-tours': 'tours_domestic',
  '/international-tours': 'tours_international',
  '/vehicle-rentals': 'vehicles',
  '/airport-transfers': 'transfers',
};

interface HeaderProps {
  navMenus?: NavMenuWithItems[];
  pool?: Record<string, PoolItem[]>;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ navMenus = [], pool = {} }: HeaderProps) {
  const { brandName, whatsappNumber } = useBranding();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-brand-dark/95 shadow-brand backdrop-blur supports-[backdrop-filter]:bg-brand-dark/80'
          : 'bg-transparent',
      )}
    >
      <div className="container-brand flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Brand */}
        <Link
          href="/"
          prefetch
          className={cn(
            'group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            scrolled ? 'text-white' : 'text-gray-900',
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-brand transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-semibold leading-none tracking-tight lg:text-xl">
            {brandName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {navMenus.map((menu) => {
            const hasItems = menu.nav_items.length > 0;
            const poolModule = URL_TO_MODULE[menu.url] ?? null;
            const poolItems = poolModule ? (pool[poolModule] ?? []) : [];
            const hasMega = poolItems.length > 0;
            const active = isActive(pathname, menu.url);

            if (!hasItems && !hasMega) {
              return (
                <Link
                  key={menu.id}
                  href={menu.url}
                  prefetch
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    scrolled ? 'text-white/90 hover:text-white' : 'text-gray-800 hover:text-gray-900',
                    active && (scrolled ? 'text-white' : 'text-gray-900'),
                  )}
                >
                  {menu.title}
                </Link>
              );
            }

            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.id)}
                onFocus={() => setOpenMenu(menu.id)}
              >
                <Link
                  href={menu.url}
                  prefetch
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    scrolled ? 'text-white/90 hover:text-white' : 'text-gray-800 hover:text-gray-900',
                    active && (scrolled ? 'text-white' : 'text-gray-900'),
                  )}
                >
                  {menu.title}
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform duration-200', openMenu === menu.id && 'rotate-180')}
                    aria-hidden="true"
                  />
                </Link>

                {openMenu === menu.id && (
                  hasMega ? (
                    // Pool-aware mega dropdown with image cards
                    <div
                      className="absolute left-1/2 top-full z-50 mt-2 w-[480px] -translate-x-1/2 rounded-xl border border-border bg-popover p-4 shadow-brand animate-fade-in"
                      role="menu"
                    >
                      {hasItems && (
                        <div className="mb-3 flex flex-wrap gap-1 border-b border-border pb-3">
                          {menu.nav_items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.url}
                              prefetch
                              role="menuitem"
                              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        {poolItems.slice(0, 6).map((item) => (
                          <Link
                            key={item.url}
                            href={item.url}
                            prefetch
                            role="menuitem"
                            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                              {item.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.cover_image}
                                  alt={item.label}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Sparkles className="h-5 w-5 text-muted-foreground/30" />
                                </div>
                              )}
                              {item.badge_text && (
                                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                  {item.badge_text}
                                </span>
                              )}
                            </div>
                            <p className="truncate px-2 py-1.5 text-xs font-medium text-foreground">{item.label}</p>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={menu.url}
                        prefetch
                        className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
                      >
                        View all &rarr;
                      </Link>
                    </div>
                  ) : (
                    // Standard dropdown
                    <div
                      className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-border bg-popover p-2 shadow-brand animate-fade-in"
                      role="menu"
                    >
                      {menu.nav_items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          prefetch
                          role="menuitem"
                          className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="font-medium text-foreground">{item.title}</span>
                          {item.description && (
                            <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground sm:inline-flex"
          >
            <Link href={waHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact" prefetch>Get Quote</Link>
          </Button>

          {/* Mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'lg:hidden',
                  scrolled
                    ? 'text-white hover:bg-white/10 hover:text-white'
                    : 'text-gray-900 hover:bg-black/10 hover:text-gray-900',
                )}
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 max-w-xs overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle className="font-heading text-xl">{brandName}</SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile primary" className="flex flex-col gap-0.5">
                {navMenus.map((menu) => {
                  const poolModule = URL_TO_MODULE[menu.url] ?? null;
                  const poolItems = poolModule ? (pool[poolModule] ?? []) : [];
                  const hasSubItems = menu.nav_items.length > 0 || poolItems.length > 0;
                  const expanded = mobileExpanded === menu.id;

                  if (!hasSubItems) {
                    return (
                      <Link
                        key={menu.id}
                        href={menu.url}
                        prefetch
                        className={cn(
                          'rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent',
                          isActive(pathname, menu.url) && 'bg-accent text-accent-foreground',
                        )}
                      >
                        {menu.title}
                      </Link>
                    );
                  }

                  return (
                    <div key={menu.id} className="py-0.5">
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(expanded ? null : menu.id)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                      >
                        {menu.title}
                        <ChevronDown
                          className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                          aria-hidden="true"
                        />
                      </button>
                      {expanded && (
                        <div className="ml-3 mt-1 border-l border-border pl-2">
                          {menu.nav_items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.url}
                              prefetch
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              {item.title}
                            </Link>
                          ))}
                          {poolItems.slice(0, 8).map((item) => (
                            <Link
                              key={item.url}
                              href={item.url}
                              prefetch
                              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              <span>{item.label}</span>
                              {item.badge_text && (
                                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  {item.badge_text}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                <Button asChild className="w-full" size="sm">
                  <Link href="/contact" prefetch>Get Quote</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground"
                >
                  <Link href={waHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp Us
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
