import { Users, Star, MapPinned, CalendarClock } from 'lucide-react';

interface TrustBarProps {
  stats: { travelers: string; rating: string; packages: string; years: string };
}

const items = [
  { key: 'travelers', label: 'Happy Travelers', icon: Users },
  { key: 'rating', label: 'Average Rating', icon: Star },
  { key: 'packages', label: 'Curated Packages', icon: MapPinned },
  { key: 'years', label: 'Years of Service', icon: CalendarClock },
] as const;

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section className="border-b border-border bg-card">
      <div className="container-brand grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {items.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex flex-col items-center text-center">
            <Icon className="h-7 w-7 text-secondary" />
            <span className="mt-2 font-heading text-2xl font-semibold text-foreground">
              {stats[key]}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
