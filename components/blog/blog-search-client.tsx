'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface BlogSearchClientProps {
  categories: string[];
  activeCategory?: string;
  initialQuery?: string;
}

export function BlogSearchClient({ categories, activeCategory, initialQuery }: BlogSearchClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery ?? '');

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setParam('category', '')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground hover:bg-primary/10'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setParam('category', cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground hover:bg-primary/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <input
        type="search"
        placeholder="Search posts..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setParam('q', q);
        }}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
      />
    </div>
  );
}
