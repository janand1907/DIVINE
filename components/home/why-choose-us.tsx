import { Compass, ShieldCheck, Headset, Wallet } from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';

interface WhyChooseUsProps {
  heading: string;
}

const features = [
  {
    icon: Compass,
    title: 'Curated Itineraries',
    description: 'Hand-crafted tour plans by destination experts with deep local knowledge.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Reliable',
    description: 'Verified partners, insured transport, and 24×7 on-trip support.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Headset,
    title: '24/7 Concierge',
    description: 'Chennai-based travel team reachable on WhatsApp throughout your trip.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Wallet,
    title: 'Transparent Pricing',
    description: 'No hidden costs. Inclusions and exclusions are spelled out upfront.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

export function WhyChooseUs({ heading }: WhyChooseUsProps) {
  return (
    <section className="section-py bg-background">
      <div className="container-brand">
        <SectionHeading
          title={heading}
          subtitle="What sets Divine Travel apart from the rest"
          eyebrow="Why Us"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, color, bg }, idx) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[var(--shadow-md)]"
            >
              {/* Subtle number watermark */}
              <span className="absolute right-4 top-3 font-heading text-6xl font-bold text-foreground/[0.03] select-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="mt-4 font-heading text-[15px] font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
