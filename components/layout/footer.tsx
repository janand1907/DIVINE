import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Branding } from '@/lib/theme/theme-provider';
import type { FooterLink } from '@/types/database';

export interface FooterSocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
}

export interface FooterProps {
  branding: Branding;
  footerLinks?: FooterLink[];
  socialLinks?: FooterSocialLinks;
  className?: string;
}

const DEFAULT_QUICK_LINKS: FooterLink[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Packages', url: '/packages' },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

const TOUR_CATEGORY_LINKS: FooterLink[] = [
  { label: 'Divine Tours', url: '/divine-tours' },
  { label: 'Domestic Tours', url: '/domestic-tours' },
  { label: 'International Tours', url: '/international-tours' },
  { label: 'FAQ', url: '/faq' },
];

const SERVICES_LINKS: FooterLink[] = [
  { label: 'Vehicle Rentals', url: '/vehicle-rentals' },
  { label: 'Airport Transfers', url: '/airport-transfers' },
  { label: 'Hotel Assistance', url: '/hotel-assistance' },
];

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer({ branding, footerLinks, socialLinks, className }: FooterProps) {
  const { brandName, address, contactPhone, contactEmail, whatsappNumber } = branding;
  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`;
  const year = new Date().getFullYear();

  const quickLinks = footerLinks && footerLinks.length > 0 ? footerLinks : DEFAULT_QUICK_LINKS;

  const activeSocialLinks = socialLinks
    ? Object.entries(socialLinks)
        .filter(([, url]) => url)
        .map(([platform, url]) => ({
          label: platform.charAt(0).toUpperCase() + platform.slice(1),
          href: url as string,
          icon: SOCIAL_ICON_MAP[platform] ?? Facebook,
        }))
    : [
        { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
        { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
        { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
        { label: 'Twitter / X', href: 'https://twitter.com', icon: Twitter },
      ];

  return (
    <footer className={cn('bg-brand-dark text-brand-darkForeground', className)}>
      <div className="container-brand py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <span className="font-heading text-xl font-semibold text-white">{brandName}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-brand-darkForeground/70">
              Divine journeys, domestic escapes, and international adventures —
              crafted with devotion and decades of travel expertise.
            </p>
            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {activeSocialLinks.map(({ label, href, icon: Icon }) => (
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
            )}
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links" className="space-y-4">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h2>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    prefetch={!link.open_new_tab}
                    target={link.open_new_tab ? '_blank' : undefined}
                    rel={link.open_new_tab ? 'noopener noreferrer' : undefined}
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
                <li key={link.url}>
                  <Link
                    href={link.url}
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
                <li key={link.url}>
                  <Link
                    href={link.url}
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
          <p>© {year} {brandName}. All rights reserved.</p>
          <p>Powered by Next.js</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
