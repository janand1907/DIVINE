'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const sortOptions = [
  { value: 'updated', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'duration', label: 'Longest Duration' },
];

export function PackageSortSelect({ defaultValue = 'updated' }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <select
      aria-label="Sort packages"
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      defaultValue={defaultValue}
      onChange={(e) => {
        const next = new URLSearchParams(params.toString());
        next.set('sort', e.target.value);
        router.push(`${pathname}?${next.toString()}`);
      }}
    >
      {sortOptions.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
