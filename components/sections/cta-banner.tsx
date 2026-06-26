interface Props {
  config: Record<string, unknown>;
}

export function CtaBanner({ config }: Props) {
  const heading = (config.heading as string) || '';
  const subheading = (config.subheading as string) || '';
  const ctaText = (config.cta_text as string) || 'Get in Touch';
  const ctaUrl = (config.cta_url as string) || '/contact';
  const secondaryCtaText = (config.secondary_cta_text as string) || '';
  const secondaryCtaUrl = (config.secondary_cta_url as string) || '';
  const background = (config.background as string) || 'dark';
  const includeWhatsapp = (config.include_whatsapp as boolean) ?? false;

  const bgClass =
    background === 'primary' ? 'bg-primary text-primary-foreground' :
    background === 'gradient' ? 'bg-gradient-to-r from-brand-dark to-primary text-white' :
    'bg-brand-dark text-white';

  if (!heading && !ctaText) return null;

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container-brand text-center">
        {heading && (
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">{heading}</h2>
        )}
        {subheading && (
          <p className="mx-auto mt-3 max-w-xl opacity-85">{subheading}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {ctaText && ctaUrl && (
            <a
              href={ctaUrl}
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-medium text-brand-dark transition hover:bg-white/90"
            >
              {ctaText}
            </a>
          )}
          {secondaryCtaText && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-medium transition hover:bg-white/10"
            >
              {secondaryCtaText}
            </a>
          )}
          {includeWhatsapp && (
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#20bd5a]"
            >
              WhatsApp Us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
