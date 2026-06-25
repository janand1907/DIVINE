import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Branding } from '@/lib/theme/theme-provider';

export interface FooterProps {
  /** Branding data injected from the server (sourced from theme_settings). */
  branding: Branding;
  className?: string;
}

interface QuickLink {
  label: string;
  href: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Packages', href: '/packages' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const TOUR_CATEGORY_LINKS: QuickLink[] = [
  { label: 'Divine Tours', href: '/divine-tours' },
  { label: 'Domestic Tours', href: '/domestic-tours' },
  { label: 'International Tours', href: '/international-tours' },
  { label: 'FAQ', href: '/faq' },
];

const SERVICES_LINKS: QuickLink[] = [
  { label: 'Vehicle Rentals', href: '/vehicle-rentals' },
  { label: 'Airport Transfers', href: '/airport-transfers' },
  { label: 'Hotel Assistance', href: '/hotel-assistance' },
];

const SOCIAL_LINKS: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: Twitter },
];

/**
 * Multi-column public site footer. Server component — branding data is passed
 * in from the server layout (sourced from Supabase `theme_settings`). Surfaces
 * brand info, quick links, tour categories, and contact details.
 */
export function Footer({ branding, className }: FooterProps) {
  const {
    brandName,
    address,
    contactPhone,
    contactEmail,
    whatsappNumber,
  } = branding;

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`;
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn('bg-brand-dark text-brand-darkForeground', className)}
    >
      <div className="container-brand py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <span className="font-heading text-xl font-semibold text-white">
                {brandName}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-brand-darkForeground/70">
              Divine journeys, domestic escapes, and international adventures —
              crafted with devotion and decades of travel expertise.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-brand-darkForeground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links" className="space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h2>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className="text-sm text-brand-darkForeground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tour categories */}
          <nav aria-label="Footer tour categories" className="space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Tour Categories
            </h2>
            <ul className="space-y-2.5">
              {TOUR_CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className="text-sm text-brand-darkForeground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Footer services" className="space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h2>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className="text-sm text-brand-darkForeground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h2>
            <ul className="space-y-3 text-sm text-brand-darkForeground/70">
              {address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    {address}
                    <br />
                    Chennai, Tamil Nadu, India
                  </span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <a
                    href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
                    className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="break-all transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                >
                  {whatsappNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-darkForeground/60 sm:flex-row">
          <p>
            © {year} {brandName}. All rights reserved.
          </p>
          <p>Powered by Next.js</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
