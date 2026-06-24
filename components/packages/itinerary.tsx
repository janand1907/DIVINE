'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItineraryDay } from '@/types/database';

export function Itinerary({ days }: { days: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(days[0]?.day ?? null);
  if (days.length === 0) return null;

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const open = openDay === day.day;
        return (
          <div key={day.day} className="overflow-hidden rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpenDay(open ? null : day.day)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-accent"
              aria-expanded={open}
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {day.day}
                </span>
                <span className="font-heading font-medium text-foreground">{day.title}</span>
              </span>
              <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', open && 'rotate-180')} />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-[3.85rem] text-sm text-muted-foreground">{day.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
