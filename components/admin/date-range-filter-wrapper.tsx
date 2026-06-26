'use client';

import { DateRangeFilter } from '@/components/admin/analytics-charts';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentRange: '7' | '30' | '90' | 'all';
}

export function DateRangeFilterWrapper({ currentRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleRangeChange(newRange: '7' | '30' | '90' | 'all') {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', newRange);
    router.push(`/admin?${params.toString()}`);
  }

  return <DateRangeFilter selectedRange={currentRange} onRangeChange={handleRangeChange} />;
}
