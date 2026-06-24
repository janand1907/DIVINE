'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

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

/** The nine divine-tour categories surfaced in the mega-menu. */
const DIVINE_TOUR_CATEGORIES: { name: string; slug: string; blurb: string }[] = [
  { name: 'Tirupati', slug: 'tirupati', blurb: 'Lord Venkateswara darshan' },
  { name: 'Varanasi', slug: 'varanasi', blurb: 'Sacred Ganga aarti & temples' },
  { name: 'Rameswaram', slug: 'rameswaram', blurb: 'Ramanathaswamy & Dhanushkodi' },
  { name: 'Vaishno Devi', slug: 'vaishno-devi', blurb: 'Maa Vaishnavi shrine trek' },
  { name: 'Kedarnath', slug: 'kedarnath', blurb: 'Jyotirlinga in the Himalayas' },
  { name: 'Amarnath', slug: 'amarnath', blurb: 'Ice Shivlinga pilgrimage' },
  { name: 'Shirdi', slug: 'shirdi', blurb: 'Sai Baba samadhi mandir' },
  { name: 'Puri Jagannath', slug: 'puri', blurb: 'Lord Jagannath & Konark' },
  { name: 'Haridwar‑Rishikesh', slug: 'haridwar-rishikesh', blurb: 'Yoga capital & Ganga pooja' },
];

interface NavLink {
  label: string;
  href: string;
}

const PRIMARY_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Domestic Tours', href: '/domestic-tours' },
  { label: 'International Tours', href: '/international-tours' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Public site header. Transparent while at the top of the page, switching to a
 * solid brand-dark surface after scrolling 24px. Includes a Divine Tours
 * mega-menu on desktop and a Slide-in Sheet for mobile navigation.
 */
export function Header() {
  const { brandName, whatsappNumber } = useBranding();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [divineOpen, setDivineOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on route change.
  useEffect(() => {
    setMobileOpen(false);
    setDivineOpen(false);
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
            'group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark',
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
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setDivineOpen(false)}
        >
          <div
            className="relative"
            onMouseEnter={() => setDivineOpen(true)}
            onFocus={() => setDivineOpen(true)}
          >
            <Link
              href="/divine-tours"
              prefetch
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark',
                scrolled
                  ? 'text-white/90 hover:text-white'
                  : 'text-gray-800 hover:text-gray-900',
                isActive(pathname, '/divine-tours') && (scrolled ? 'text-white' : 'text-gray-900'),
              )}
            >
              Divine Tours
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  divineOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </Link>

            {/* Mega-menu */}
            {divineOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 w-[28rem] -translate-x-1/2 rounded-xl border border-border bg-popover p-4 shadow-brand animate-fade-in"
                role="menu"
                aria-label="Divine tour categories"
              >
                <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    Divine Tour Categories
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {DIVINE_TOUR_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/divine-tours/${cat.slug}`}
                      prefetch
                      role="menuitem"
                      className="rounded-md p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {cat.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/divine-tours"
                  prefetch
                  className="mt-3 block rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View all Divine Tours
                </Link>
              </div>
            )}
          </div>

          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark',
                scrolled
                  ? 'text-white/90 hover:text-white'
                  : 'text-gray-800 hover:text-gray-900',
                isActive(pathname, link.href) && (scrolled ? 'text-white' : 'text-gray-900'),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground sm:inline-flex"
          >
            <Link
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with ${brandName} on WhatsApp`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/contact" prefetch>
              Get Quote
            </Link>
          </Button>

          {/* Mobile hamburger → Sheet */}
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

              <nav aria-label="Mobile primary" className="flex flex-col gap-1">
                {/* Divine tours with stacked categories */}
                <div className="py-1">
                  <Link
                    href="/divine-tours"
                    prefetch
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    Divine Tours
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <div className="ml-3 border-l border-border pl-2">
                    {DIVINE_TOUR_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/divine-tours/${cat.slug}`}
                        prefetch
                        className={cn(
                          'block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                          isActive(pathname, `/divine-tours/${cat.slug}`) &&
                            'font-medium text-foreground',
                        )}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {PRIMARY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent',
                      isActive(pathname, link.href) && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                <Button asChild className="w-full" size="sm">
                  <Link href="/contact" prefetch>
                    Get Quote
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full bg-brand-whatsapp text-brand-whatsappForeground hover:bg-brand-whatsapp/90 hover:text-brand-whatsappForeground"
                >
                  <Link
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
