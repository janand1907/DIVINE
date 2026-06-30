'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Clock, Phone, Navigation, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchAirports, getTopAirports, type Airport, type SearchGroup } from '@/lib/airports/search';

interface AirportSearchProps {
  value?: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function AirportSearch({
  value,
  onChange,
  placeholder = 'Search airport, city or code...',
  label,
  id,
}: AirportSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [highlighted, setHighlighted] = useState<Airport | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const topAirports = getTopAirports();

  useEffect(() => {
    if (query.length < 1) {
      setGroups([]);
      return;
    }
    const results = searchAirports(query);
    setGroups(results);
    if (results.length && results[0].items.length) {
      setHighlighted(results[0].items[0]);
    }
  }, [query]);

  const allItems = groups.flatMap((g) => g.items);

  const select = useCallback((airport: Airport) => {
    onChange(airport);
    setQuery('');
    setOpen(false);
  }, [onChange]);

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = allItems.indexOf(highlighted!);
      setHighlighted(allItems[Math.min(idx + 1, allItems.length - 1)] ?? allItems[0]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = allItems.indexOf(highlighted!);
      setHighlighted(allItems[Math.max(idx - 1, 0)]);
    } else if (e.key === 'Enter' && highlighted) {
      e.preventDefault();
      select(highlighted);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  const showDropdown = open && (query.length > 0 || !value);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Plane className="h-3 w-3 text-primary" />
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        className={cn(
          'flex h-12 w-full cursor-text items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] bg-background px-3 transition-[border-color,box-shadow]',
          open
            ? 'border-primary/70 shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)]'
            : 'border-input hover:border-primary/45',
        )}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        {value && !open ? (
          <div className="flex flex-1 items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{value.city}</span>
              <span className="block text-[11px] text-muted-foreground truncate">{value.iata} — {value.name}</span>
            </div>
            <button type="button" onClick={clear} className="ml-2 shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              id={id}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={value ? `${value.city} (${value.iata})` : placeholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              autoComplete="off"
            />
            <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
          </>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-lg)]">
          {groups.length > 0 ? (
            <div className="max-h-72 overflow-y-auto py-1">
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </div>
                  {group.items.map((airport) => (
                    <button
                      key={airport.iata}
                      type="button"
                      onMouseEnter={() => setHighlighted(airport)}
                      onClick={() => select(airport)}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                        highlighted?.iata === airport.iata ? 'bg-primary/8' : 'hover:bg-muted/60',
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-xs font-bold text-primary">
                        {airport.iata}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{airport.name}</span>
                        <span className="block text-xs text-muted-foreground">{airport.city}, {airport.state}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : query.length === 0 ? (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Popular Airports
              </div>
              <div className="max-h-72 overflow-y-auto">
                {topAirports.map((airport) => (
                  <button
                    key={airport.iata}
                    type="button"
                    onClick={() => select(airport)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-xs font-bold text-primary">
                      {airport.iata}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{airport.name}</span>
                      <span className="block text-xs text-muted-foreground">{airport.city}, {airport.state}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <Plane className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm font-medium text-foreground">No airports found</p>
              <p className="text-xs text-muted-foreground">Try city name, IATA code or state</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Airport Info Panel ───────────────────────────────────────────────────────
interface AirportInfoPanelProps {
  airport: Airport;
}

export function AirportInfoPanel({ airport }: AirportInfoPanelProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 font-heading text-xl font-bold text-primary">
          {airport.iata}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold text-foreground leading-snug">{airport.name}</h3>
          <p className="text-sm text-muted-foreground">{airport.city}, {airport.state}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-start gap-2.5 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{airport.address}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{airport.hours}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Phone className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{airport.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Navigation className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}
