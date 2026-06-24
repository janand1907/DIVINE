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
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Reliable',
    description: 'Verified partners, insured transport, and 24x7 on-trip support.',
  },
  {
    icon: Headset,
    title: '24/7 Concierge',
    description: 'Chennai-based travel team reachable on WhatsApp throughout your trip.',
  },
  {
    icon: Wallet,
    title: 'Transparent Pricing',
    description: 'No hidden costs. Inclusions and exclusions are spelled out upfront.',
  },
];

export function WhyChooseUs({ heading }: WhyChooseUsProps) {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle="What sets Divine Travel apart" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-6 shadow-brand transition hover:border-primary"
            >
              <div className="inline-flex rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
