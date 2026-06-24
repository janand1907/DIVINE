interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <span className="inline-block h-1 w-12 rounded-full bg-primary" aria-hidden />
      <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg text-balance">{subtitle}</p>
      )}
    </div>
  );
}
