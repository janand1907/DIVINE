interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  eyebrow?: string;
}

export function SectionHeading({ title, subtitle, align = 'center', eyebrow }: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {eyebrow}
        </span>
      )}
      <div className={`flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}>
        <span className="h-0.5 w-8 rounded-full bg-primary/40 shrink-0" aria-hidden />
        <span className="h-0.5 w-16 rounded-full shrink-0" style={{ background: 'linear-gradient(90deg, rgb(var(--primary-rgb)), rgb(var(--secondary-rgb)))' }} aria-hidden />
      </div>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
