interface Props {
  config: Record<string, unknown>;
}

export function ImageBanner({ config }: Props) {
  const image = (config.image as string) || '';
  const alt = (config.alt as string) || 'Banner image';
  const caption = (config.caption as string) || '';
  const fullWidth = (config.full_width as boolean) ?? true;

  if (!image) return null;

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className={fullWidth ? '' : 'container-brand'}>
        <div className="overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} className="w-full object-cover" loading="lazy" />
        </div>
        {caption && (
          <p className="mt-3 text-center text-sm text-muted-foreground">{caption}</p>
        )}
      </div>
    </section>
  );
}
