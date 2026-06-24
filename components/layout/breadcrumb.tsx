import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/layout/json-ld';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Optional absolute site origin for the JSON-LD URLs. */
  siteUrl?: string;
  className?: string;
}

/**
 * Accessible visual breadcrumb + BreadcrumbList JSON-LD structured data.
 * The last item is rendered as plain text (the current page) and all
 * preceding items are navigation links.
 */
export function Breadcrumb({ items, siteUrl, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  const origin = siteUrl ? new URL(siteUrl).origin : '';
  const jsonLdItems = items.map((item) => ({
    name: item.name,
    url: `${origin}${item.href}`,
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(jsonLdItems)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1 rounded-lg bg-accent px-4 py-2.5 text-sm">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-foreground"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    prefetch
                    className="text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
