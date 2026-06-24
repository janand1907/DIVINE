'use client';

import { useEffect, useState } from 'react';

interface TocItem { id: string; text: string; level: number }

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const tocItems: TocItem[] = headings.map((h, i) => {
      const text = h.textContent?.trim() ?? `Section ${i}`;
      const id = h.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      h.id = id;
      return { id, text, level: h.tagName.toLowerCase() === 'h3' ? 3 : 2 };
    });
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId((visible.target as HTMLElement).id);
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="rounded-lg border border-border bg-card p-5 shadow-brand lg:sticky lg:top-24" aria-label="Table of contents">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contents</h2>
      <ul className="mt-3 space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? '0.75rem' : 0 }}>
            <a
              href={`#${item.id}`}
              className={`block py-1 text-sm transition hover:text-primary ${
                activeId === item.id ? 'font-medium text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
