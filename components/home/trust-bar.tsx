import { Users, Star, MapPinned, CalendarClock } from 'lucide-react';

interface TrustBarProps {
  stats: { travelers: string; rating: string; packages: string; years: string };
}

const items = [
  { key: 'travelers' as const, label: 'Happy Travelers', icon: Users, suffix: '' },
  { key: 'rating' as const, label: 'Average Rating', icon: Star, suffix: '/5' },
  { key: 'packages' as const, label: 'Curated Packages', icon: MapPinned, suffix: '' },
  { key: 'years' as const, label: 'Years of Service', icon: CalendarClock, suffix: '+' },
];

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section className="bg-white border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="container-brand py-0">
        <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {items.map(({ key, label, icon: Icon, suffix }, idx) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-2 px-4 py-7 text-center transition-colors hover:bg-primary/3 md:px-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="block font-heading text-2xl font-bold tracking-tight text-foreground">
                  {stats[key]}{suffix}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
