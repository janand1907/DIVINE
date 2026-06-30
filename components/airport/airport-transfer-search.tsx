'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, ArrowRight, MessageCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AirportSearch, AirportInfoPanel } from '@/components/airport/airport-search';
import { DatePicker } from '@/components/ui/date-picker';
import type { Airport } from '@/lib/airports/search';
import type { AirportRouteRow } from '@/types/database';

interface AirportTransferSearchProps {
  routes: AirportRouteRow[];
  whatsappNumber: string;
}

export function AirportTransferSearch({ routes, whatsappNumber }: AirportTransferSearchProps) {
  const router = useRouter();
  const [pickup, setPickup] = useState<Airport | null>(null);
  const [dropoff, setDropoff] = useState<Airport | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [travellers, setTravellers] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi, I need an airport transfer. Can you help?')}`;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!pickup) { setError('Please select a pickup location.'); return; }
    setError(null);
    const params = new URLSearchParams();
    if (pickup) params.set('from', pickup.iata);
    if (dropoff) params.set('to', dropoff.iata);
    if (date) params.set('date', date.toISOString().split('T')[0]);
    params.set('pax', String(travellers));
    router.push(`/contact?${params.toString()}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Search form */}
      <form onSubmit={handleSearch} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <AirportSearch
              id="pickup"
              label="Pickup Location"
              value={pickup}
              onChange={setPickup}
              placeholder="Enter city or airport code..."
            />
          </div>
          <div>
            <AirportSearch
              id="dropoff"
              label="Drop-off Location"
              value={dropoff}
              onChange={setDropoff}
              placeholder="Enter city or airport code..."
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Calendar className="h-3 w-3 text-primary" /> Travel Date
            </Label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
              fromDate={new Date()}
              className="h-12"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="travellers" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-3 w-3 text-primary" /> Travellers
            </Label>
            <div className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] border-[1.5px] border-input bg-background px-3">
              <button
                type="button"
                onClick={() => setTravellers(Math.max(1, travellers - 1))}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-muted-foreground transition hover:border-primary/50 hover:text-primary"
              >−</button>
              <span className="flex-1 text-center text-sm font-semibold text-foreground">{travellers}</span>
              <button
                type="button"
                onClick={() => setTravellers(Math.min(50, travellers + 1))}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-muted-foreground transition hover:border-primary/50 hover:text-primary"
              >+</button>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="lg" className="flex-1 gap-2 font-semibold">
            <Search className="h-4 w-4" />
            Search Transfers
          </Button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] px-6 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Get Free Quote
          </a>
        </div>
      </form>

      {/* Airport info panel */}
      <div className="space-y-3">
        {pickup ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pickup Airport Info</p>
            <AirportInfoPanel airport={pickup} />
          </>
        ) : dropoff ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drop-off Airport Info</p>
            <AirportInfoPanel airport={dropoff} />
          </>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-muted/30 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Select an airport</p>
            <p className="text-xs text-muted-foreground">Airport details will appear here when you search</p>
          </div>
        )}
      </div>
    </div>
  );
}
