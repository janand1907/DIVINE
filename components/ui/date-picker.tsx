'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  fromDate,
  toDate,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex w-full items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-input bg-background px-3 text-left text-sm transition-[border-color,box-shadow] hover:border-primary/45 focus:border-primary/70 focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
            open && 'border-primary/70 shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)]',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 truncate">
            {value ? format(value, 'PPP') : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-[var(--shadow-lg)]"
        align="start"
        sideOffset={6}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          fromDate={fromDate}
          toDate={toDate}
          initialFocus
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-3 p-3',
            caption: 'flex justify-center pt-1 relative items-center px-8',
            caption_label: 'font-heading text-sm font-semibold text-foreground',
            nav: 'flex items-center gap-1',
            nav_button:
              'flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] border border-border bg-white text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            nav_button_previous: 'absolute left-2',
            nav_button_next: 'absolute right-2',
            table: 'w-full border-collapse',
            head_row: 'flex',
            head_cell: 'w-9 rounded-md text-[11px] font-semibold uppercase tracking-wide text-muted-foreground',
            row: 'flex w-full mt-1',
            cell: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/8 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full',
            day: 'h-9 w-9 rounded-full p-0 text-sm font-medium aria-selected:opacity-100 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full',
            day_today: 'bg-accent text-accent-foreground font-semibold',
            day_outside: 'text-muted-foreground/40 opacity-50',
            day_disabled: 'text-muted-foreground/30 cursor-not-allowed',
            day_range_middle: 'aria-selected:bg-primary/10 aria-selected:text-foreground rounded-none',
            day_range_start: 'bg-primary text-primary-foreground rounded-full',
            day_range_end: 'bg-primary text-primary-foreground rounded-full',
            day_hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// Range variant for future use
interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onRangeChange: (range: { from?: Date; to?: Date }) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  from,
  to,
  onRangeChange,
  placeholder = 'Select date range',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const displayValue = from
    ? to
      ? `${format(from, 'MMM d')} – ${format(to, 'MMM d, yyyy')}`
      : format(from, 'PPP')
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-input bg-background px-3 py-2 text-left text-sm transition-[border-color,box-shadow] hover:border-primary/45 focus:outline-none',
            open && 'border-primary/70 shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)]',
            !from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 truncate">{displayValue}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-[var(--shadow-lg)]" align="start" sideOffset={6}>
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(r) => {
            onRangeChange({ from: r?.from, to: r?.to });
            if (r?.from && r?.to) setOpen(false);
          }}
          fromDate={new Date()}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
