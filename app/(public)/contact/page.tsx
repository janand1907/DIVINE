import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ContactForm } from '@/components/forms/contact-form';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/contact');
  return buildMetadata({ path: '/contact', theme, site, seoPage });
}

export default async function ContactPage() {
  const { theme } = await fetchSeoContext('/contact');
  const phone = theme?.contact_phone ?? '+91 98765 43210';
  const email = theme?.contact_email ?? 'info@divinetravel.in';
  const address = theme?.address ?? 'T. Nagar, Chennai, Tamil Nadu 600017';
  const whatsapp = theme?.whatsapp_number ?? '+919876543210';

  return (
    <>
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }]} />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Get in Touch</h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Questions about a tour or planning a custom itinerary? Our Chennai-based travel desk is here to help.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container-brand grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr]">
          {/* Contact info sidebar */}
          <aside className="space-y-4">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-brand transition hover:border-primary"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-whatsapp text-brand-whatsappForeground">
                <MessageCircle className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                <p className="font-medium text-foreground">{whatsapp}</p>
              </div>
            </a>

            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-brand transition hover:border-primary">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{phone}</p>
              </div>
            </a>

            <a href={`mailto:${email}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-brand transition hover:border-primary">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-brand">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Office</p>
                <p className="font-medium text-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-brand">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Clock className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Hours</p>
                <p className="font-medium text-foreground">Mon - Sat, 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-brand">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We respond within 24 hours.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
