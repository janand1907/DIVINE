import type { Metadata } from 'next';
import { Compass, Heart, Users, MapPin, Phone, Mail, Clock, Shield, Award, Headset } from 'lucide-react';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeading } from '@/components/layout/section-heading';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/about');
  return buildMetadata({ path: '/about', theme, site, seoPage });
}

const missionValues = [
  {
    icon: Compass,
    title: 'Guided Journeys',
    desc: 'We craft every itinerary with care — balancing famous landmarks with hidden gems for a complete pilgrimage experience.',
  },
  {
    icon: Heart,
    title: 'Devotion First',
    desc: 'Sacred travel is a calling. We honor the spiritual significance of every temple, shrine, and ritual in your journey.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Traveling with us means traveling with family. Small groups, trusted guides, and a community of fellow pilgrims.',
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: '15+ Years of Expertise',
    desc: 'A decade and a half of crafting pilgrimage journeys with deep local knowledge and trusted partnerships.',
  },
  {
    icon: Shield,
    title: 'Safe & Transparent',
    desc: 'No hidden costs, vetted accommodations, and 24/7 on-tour support for total peace of mind.',
  },
  {
    icon: Headset,
    title: '24/7 Travel Support',
    desc: 'Our Chennai-based travel desk is available around the clock — before, during, and after your journey.',
  },
  {
    icon: Clock,
    title: 'Timely & Reliable',
    desc: 'Punctual pickups, well-paced itineraries, and carefully coordinated logistics for a stress-free trip.',
  },
];

export default async function AboutPage() {
  const { theme, site } = await fetchSeoContext('/about');
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const contactPhone = theme?.contact_phone ?? null;
  const contactEmail = theme?.contact_email ?? 'hello@divinetravel.in';
  const address = theme?.address ?? 'Chennai, Tamil Nadu, India';
  const siteUrl = site?.site_url ?? undefined;

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi, I would like to plan a trip with Divine Travel')}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
            ]}
            siteUrl={siteUrl}
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
            About Divine Travel
          </h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Chennai-based pilgrimage experts crafting sacred journeys across India and beyond.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-background py-16">
        <div className="container-brand grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <SectionHeading title="Our Story" align="left" />
            <div className="mt-4 space-y-4 text-foreground/90 leading-relaxed">
              <p>
                Founded in Chennai, Divine Travel was born from a simple calling — to make sacred journeys
                accessible, meaningful, and effortless. What began as a small team organizing temple visits
                for friends and family has grown into a trusted name for pilgrimage tours across India.
              </p>
              <p>
                For over fifteen years we have specialized in Navagraha temple circuits, Tirupati darshan,
                Rameswaram and Kashi pilgrimages, Char Dham yatra, and Kailash Mansarovar expeditions.
                Our roots in Tamil Nadu give us deep local insight — from the temple rituals of Tamil Nadu
                to the Himalayan shrines of the north — while our network of priests, drivers, and guides
                spans the country.
              </p>
              <p>
                We believe travel is a bridge between the seen and the sacred. Every itinerary we craft
                blends logistical reliability with the spiritual depth each destination deserves — from
                the first dip in a holy river to the final aarti. Your journey is not just a trip; it is
                a memory you will carry for a lifetime.
              </p>
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-6 shadow-brand">
              <h3 className="font-heading text-lg font-semibold text-foreground">Get in Touch</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{address}</span>
                </li>
                {contactPhone && (
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-primary" />
                    <a href={`tel:${contactPhone.replace(/[^\d]/g, '')}`} className="text-foreground hover:text-primary">
                      {contactPhone}
                    </a>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <a href={`mailto:${contactEmail}`} className="text-foreground hover:text-primary">
                    {contactEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Mon–Sat, 9 AM – 8 PM IST</span>
                </li>
              </ul>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-whatsapp px-5 py-2.5 font-medium text-brand-whatsappForeground"
              >
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-accent py-16">
        <div className="container-brand">
          <SectionHeading
            title="Our Mission"
            subtitle="The values that guide every journey we plan"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {missionValues.map((v) => (
              <div
                key={v.title}
                className="rounded-lg border border-border bg-card p-6 shadow-brand"
              >
                <div className="inline-flex rounded-lg bg-primary/10 p-3">
                  <v.icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-background py-16">
        <div className="container-brand">
          <SectionHeading
            title="Why Choose Us"
            subtitle="What sets Divine Travel apart"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((v) => (
              <div
                key={v.title}
                className="rounded-lg border border-border bg-card p-6 shadow-brand"
              >
                <div className="inline-flex rounded-lg bg-secondary/10 p-3">
                  <v.icon className="h-6 w-6 text-secondary" aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-brand-dark py-16 text-brand-darkForeground">
        <div className="container-brand text-center">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl text-balance">
            Ready for your sacred journey?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-darkForeground/80">
            Our Chennai-based travel desk is here to help you plan the perfect pilgrimage. Reach out on WhatsApp for instant assistance.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-whatsapp px-6 py-3 font-medium text-brand-whatsappForeground"
          >
            Talk to Our Travel Desk
          </a>
        </div>
      </section>
    </>
  );
}
