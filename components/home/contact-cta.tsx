import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
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
  const waHref = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`;

  return (
    <section className="section-py relative overflow-hidden bg-[rgb(var(--dark-rgb))]">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        aria-hidden
      />
      {/* Gradient accent */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

      <div className="container-brand relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Left: Info */}
        <div>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Get In Touch
          </span>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 rounded-full bg-primary/40" aria-hidden />
            <span className="h-0.5 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--primary-rgb)), rgb(var(--secondary-rgb)))' }} aria-hidden />
          </div>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-white text-balance sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
            Tell us about your trip. Our Chennai travel desk will craft a personalised plan and reach out within 24 hours.
          </p>

          <div className="mt-9 space-y-5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 transition"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[#25D366]/15 text-[#25D366] ring-1 ring-[#25D366]/20 transition group-hover:bg-[#25D366]/25">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/40">WhatsApp</span>
                <span className="font-medium text-white group-hover:text-[#25D366] transition-colors">{whatsappNumber}</span>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-white/30 transition group-hover:text-[#25D366] group-hover:translate-x-1" />
            </a>

            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
                className="group flex items-center gap-4 transition"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white/8 text-white/70 ring-1 ring-white/10 transition group-hover:bg-white/14 group-hover:text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/40">Call us</span>
                  <span className="font-medium text-white">{contactPhone}</span>
                </div>
              </a>
            )}

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="group flex items-center gap-4 transition"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white/8 text-white/70 ring-1 ring-white/10 transition group-hover:bg-white/14 group-hover:text-white">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/40">Email us</span>
                  <span className="font-medium text-white">{contactEmail}</span>
                </div>
              </a>
            )}

            {address && (
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white/8 text-white/70 ring-1 ring-white/10">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/40">Visit us</span>
                  <span className="font-medium text-white">{address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form card */}
        <div className="rounded-[var(--radius-xl)] bg-white p-7 shadow-[var(--shadow-xl)] sm:p-8">
          <h3 className="font-heading text-xl font-semibold text-foreground">Get a Free Quote</h3>
          <p className="mt-1 text-sm text-muted-foreground">No obligation. We reply within 24 hours.</p>
          <div className="mt-6">
            <QuickQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
