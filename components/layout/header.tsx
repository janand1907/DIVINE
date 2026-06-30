'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, MessageCircle, Sparkles, Phone } from 'lucide-react';
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
  const { brandName, whatsappNumber, contactPhone } = useBranding();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelClose();
        setOpenMenu(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimerRef.current = null;
    }, 300);
  }, [cancelClose]);

  const handleMenuEnter = useCallback((id: string) => {
    cancelClose();
    setOpenMenu(id);
  }, [cancelClose]);

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="container-brand flex h-16 items-center justify-between gap-4 lg:h-[68px]">

        {/* Brand */}
        <Link
          href="/"
          prefetch
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-gradient text-white shadow-[var(--shadow-primary)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className={cn(
            'font-heading text-[17px] font-semibold leading-none tracking-tight transition-colors duration-300',
            scrolled ? 'text-foreground' : 'text-white',
          )}>
            {brandName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navMenus.map((menu) => {
            const hasItems = menu.nav_items.length > 0;
            const poolModule = URL_TO_MODULE[menu.url] ?? null;
            const poolItems = poolModule ? (pool[poolModule] ?? []) : [];
            const hasMega = poolItems.length > 0;
            const active = isActive(pathname, menu.url);

            const linkCls = cn(
              'relative px-3 py-2 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg',
              scrolled
                ? 'text-foreground/80 hover:text-foreground hover:bg-muted'
                : 'text-white/90 hover:text-white hover:bg-white/10',
              active && (scrolled
                ? 'text-primary font-semibold'
                : 'text-white font-semibold'),
            );

            if (!hasItems && !hasMega) {
              return (
                <Link
                  key={menu.id}
                  href={menu.url}
                  prefetch
                  aria-current={active ? 'page' : undefined}
                  className={linkCls}
                >
                  {menu.title}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            }

            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => handleMenuEnter(menu.id)}
                onMouseLeave={scheduleClose}
                onFocus={() => handleMenuEnter(menu.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    scheduleClose();
                  }
                }}
              >
                <Link
                  href={menu.url}
                  prefetch
                  aria-expanded={openMenu === menu.id}
                  aria-haspopup="menu"
                  className={cn(linkCls, 'inline-flex items-center gap-1')}
                >
                  {menu.title}
                  <ChevronDown
                    className={cn('h-3.5 w-3.5 transition-transform duration-200', openMenu === menu.id && 'rotate-180')}
                    aria-hidden="true"
                  />
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>

                {/* Dropdown — invisible 8px bridge prevents hover gap */}
                <div
                  className={cn(
                    'absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2',
                    'transition-all duration-200',
                    openMenu === menu.id
                      ? 'pointer-events-auto opacity-100 translate-y-0'
                      : 'pointer-events-none opacity-0 -translate-y-1',
                  )}
                  role="menu"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  {hasMega ? (
                    <div className="w-[520px] rounded-[var(--radius-lg)] border border-border bg-white p-5 shadow-[var(--shadow-lg)]">
                      {hasItems && (
                        <div className="mb-4 flex flex-wrap gap-1 border-b border-border pb-4">
                          {menu.nav_items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.url}
                              prefetch
                              role="menuitem"
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/8 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2.5">
                        {poolItems.slice(0, 6).map((item) => (
                          <Link
                            key={item.url}
                            href={item.url}
                            prefetch
                            role="menuitem"
                            className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-background transition-all hover:border-primary/30 hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                  {item.badge_text}
                                </span>
                              )}
                            </div>
                            <p className="truncate px-2.5 py-2 text-xs font-medium text-foreground">{item.label}</p>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={menu.url}
                        prefetch
                        className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        View all {menu.title} &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="w-60 rounded-[var(--radius-lg)] border border-border bg-white p-2 shadow-[var(--shadow-lg)]">
                      {menu.nav_items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          prefetch
                          role="menuitem"
                          className="flex items-start gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-foreground">{item.title}</span>
                            {item.description && (
                              <span className="mt-0.5 block text-xs text-muted-foreground leading-relaxed">{item.description}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {contactPhone && (
            <a
              href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
              className={cn(
                'hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors xl:flex',
                scrolled ? 'text-foreground/70 hover:text-foreground' : 'text-white/80 hover:text-white',
              )}
            >
              <Phone className="h-3.5 w-3.5" />
              {contactPhone}
            </a>
          )}

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-[13px] font-semibold text-white transition-all hover:brightness-110 sm:flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>

          <Button asChild size="sm" className="hidden text-[13px] sm:inline-flex">
            <Link href="/contact" prefetch>Get Quote</Link>
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden',
                  scrolled
                    ? 'text-foreground hover:bg-muted'
                    : 'text-white hover:bg-white/15',
                )}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] overflow-y-auto p-0">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="flex items-center gap-2.5 font-heading text-lg">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand-gradient text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  {brandName}
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile primary" className="flex flex-col gap-0.5 p-3">
                {navMenus.map((menu) => {
                  const poolModule = URL_TO_MODULE[menu.url] ?? null;
                  const poolItems = poolModule ? (pool[poolModule] ?? []) : [];
                  const hasSubItems = menu.nav_items.length > 0 || poolItems.length > 0;
                  const expanded = mobileExpanded === menu.id;
                  const active = isActive(pathname, menu.url);

                  if (!hasSubItems) {
                    return (
                      <Link
                        key={menu.id}
                        href={menu.url}
                        prefetch
                        className={cn(
                          'flex items-center rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted',
                          active && 'bg-primary/10 text-primary font-semibold',
                        )}
                      >
                        {menu.title}
                      </Link>
                    );
                  }

                  return (
                    <div key={menu.id}>
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(expanded ? null : menu.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted',
                          active && 'text-primary font-semibold',
                        )}
                      >
                        {menu.title}
                        <ChevronDown
                          className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', expanded && 'rotate-180')}
                          aria-hidden="true"
                        />
                      </button>
                      {expanded && (
                        <div className="ml-3 mt-0.5 border-l-2 border-primary/20 pl-3 pb-1">
                          {menu.nav_items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.url}
                              prefetch
                              className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              {item.title}
                            </Link>
                          ))}
                          {poolItems.slice(0, 8).map((item) => (
                            <Link
                              key={item.url}
                              href={item.url}
                              prefetch
                              className="flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

              <div className="flex flex-col gap-2 border-t border-border p-4">
                <Button asChild className="w-full">
                  <Link href="/contact" prefetch>Get Free Quote</Link>
                </Button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
