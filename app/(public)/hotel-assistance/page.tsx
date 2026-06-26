import { Metadata } from 'next';
import { HotelAssistanceForm } from '@/components/forms/hotel-assistance-form';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, Star, Shield } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/hotel-assistance');
  return buildMetadata({
    path: '/hotel-assistance',
    title: 'Hotel Assistance',
    description: 'Let our experts find the perfect hotel for your pilgrimage or vacation. Best rates, handpicked properties, personalized recommendations for Tirupati, Ooty, and South India.',
    theme, site, seoPage,
  });
}

const WHY_US = [
  { icon: Clock, title: 'Response in 2 Hours', desc: 'Our team calls you back with curated hotel options within 2 hours of your request.' },
  { icon: Star, title: 'Handpicked Properties', desc: 'We personally vet every hotel — only clean, comfortable, and value-for-money stays.' },
  { icon: Phone, title: 'Dedicated Support', desc: 'One point of contact from selection to checkout. We handle all bookings for you.' },
  { icon: Shield, title: 'Best Rate Guarantee', desc: 'We negotiate directly with hotels to get you rates you won\'t find online.' },
];

const WHAT_NEXT = [
  { step: '1', text: 'Submit your requirements using the form' },
  { step: '2', text: 'Our team reviews your request and finds matching hotels' },
  { step: '3', text: 'We call you within 2 hours with options and prices' },
  { step: '4', text: 'You confirm — we handle the booking end-to-end' },
];

export default async function HotelAssistancePage() {
  const { theme } = await fetchSeoContext('/hotel-assistance');
  const contactPhone = theme?.contact_phone ?? '+919876543210';
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-brand-dark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
        />
        <div className="container-brand relative z-10 py-20 text-center text-white">
          <Badge className="mb-4 bg-primary/20 text-primary">Hotel Assistance</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight lg:text-5xl">
            Let Us Find Your<br />Perfect Hotel
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Tell us your destination, dates, and budget — our travel experts will handpick the best hotels and call you within 2 hours.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="container-brand">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <HotelAssistanceForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:col-span-2">
              {/* Why use us */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Why Use Our Service?</h2>
                <div className="mt-5 space-y-5">
                  {WHY_US.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div className="rounded-2xl border border-border bg-muted/40 p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">What Happens Next?</h2>
                <ol className="mt-4 space-y-4">
                  {WHAT_NEXT.map(({ step, text }) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {step}
                      </span>
                      <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Direct contact */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-brand">
                <p className="text-sm font-medium text-foreground">Prefer to call directly?</p>
                <a
                  href={`tel:${contactPhone}`}
                  className="mt-2 block font-heading text-2xl font-bold text-primary hover:underline"
                >
                  {contactPhone}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">Available 8 AM – 10 PM, 7 days a week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="bg-muted/40 py-16">
        <div className="container-brand text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Popular Destinations We Cover</h2>
          <p className="mt-2 text-muted-foreground">We have hotel connections across all major pilgrim and leisure spots in South India</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Tirupati', 'Kanchipuram', 'Madurai', 'Rameswaram', 'Ooty', 'Kodaikanal', 'Coimbatore', 'Chennai', 'Bangalore', 'Mysore', 'Pondicherry', 'Vellore'].map((city) => (
              <span
                key={city}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
