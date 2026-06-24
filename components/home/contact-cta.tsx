import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { QuickQuoteForm } from '@/components/forms/quick-quote-form';

interface ContactCtaProps {
  heading: string;
  whatsappNumber: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  address?: string | null;
}

export function ContactCta({
  heading,
  whatsappNumber,
  contactPhone,
  contactEmail,
  address,
}: ContactCtaProps) {
  return (
    <section className="bg-brand-dark py-16 md:py-20 text-brand-darkForeground">
      <div className="container-brand grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-block h-1 w-12 rounded-full bg-primary" aria-hidden />
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl text-balance">
            {heading}
          </h2>
          <p className="mt-3 max-w-md text-brand-darkForeground/80">
            Tell us about your trip. Our Chennai travel desk will craft a plan and reach out within 24 hours.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-whatsapp text-brand-whatsappForeground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-brand-darkForeground/60">WhatsApp us</span>
                <span className="font-medium">{whatsappNumber}</span>
              </span>
            </a>

            {contactPhone && (
              <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-brand-darkForeground/60">Call us</span>
                  <span className="font-medium">{contactPhone}</span>
                </span>
              </a>
            )}

            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-brand-darkForeground/60">Email us</span>
                  <span className="font-medium">{contactEmail}</span>
                </span>
              </a>
            )}

            {address && (
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-brand-darkForeground/60">Visit our office</span>
                  <span className="font-medium">{address}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 text-foreground shadow-brand sm:p-8">
          <h3 className="font-heading text-xl font-semibold">Get a Free Quote</h3>
          <p className="mt-1 text-sm text-muted-foreground">No obligation. Reply within 24 hours.</p>
          <div className="mt-6">
            <QuickQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
