interface Props {
  config: Record<string, unknown>;
}

export function ImageGallery({ config }: Props) {
  const images = (config.images as string[]) || [];
  const layout = (config.layout as string) || 'grid';
  const columns = (config.columns as number) || 3;
  const heading = (config.heading as string) || '';

  if (images.length === 0) return null;

  const colsClass =
    columns === 2 ? 'sm:grid-cols-2' :
    columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
    'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className={`grid grid-cols-1 gap-4 ${colsClass}`}>
          {images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className={`w-full object-cover ${layout === 'masonry' ? '' : 'aspect-video'}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
