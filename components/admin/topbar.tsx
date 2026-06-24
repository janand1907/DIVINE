'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  userEmail: string;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/leads': 'Leads',
  '/admin/packages': 'Packages',
  '/admin/blog': 'Blog Posts',
  '/admin/testimonials': 'Testimonials',
  '/admin/media': 'Media Library',
  '/admin/homepage-builder': 'Homepage Builder',
  '/admin/theme': 'Theme & Branding',
  '/admin/seo-pages': 'SEO Pages',
  '/admin/site-settings': 'Site Settings',
  '/admin/destinations': 'Destinations',
  '/admin/categories': 'Categories',
  '/admin/activity': 'Activity Log',
};

export function AdminTopbar({ userEmail }: TopbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? (Object.entries(pageTitles).find(([k]) => k !== '/admin' && pathname.startsWith(k))?.[1] ?? 'Admin');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-lg font-semibold text-foreground">{title}</h1>
        <span className="hidden text-xs text-muted-foreground sm:inline">/ {userEmail}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Site
          </Link>
        </Button>
      </div>
    </header>
  );
}
