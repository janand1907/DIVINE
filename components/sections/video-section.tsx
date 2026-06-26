interface Props {
  config: Record<string, unknown>;
}

export function VideoSection({ config }: Props) {
  const videoUrl = (config.video_url as string) || '';
  const thumbnail = (config.thumbnail as string) || '';
  const heading = (config.heading as string) || '';
  const subheading = (config.subheading as string) || '';

  if (!videoUrl) return null;

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  let embedUrl = videoUrl;
  if (isYouTube) {
    const id = videoUrl.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
    if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (isVimeo) {
    const id = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-2 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        {subheading && (
          <p className="mb-8 text-center text-muted-foreground">{subheading}</p>
        )}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border">
          {isYouTube || isVimeo ? (
            <iframe
              src={embedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={heading || 'Video'}
            />
          ) : (
            <video
              src={videoUrl}
              poster={thumbnail || undefined}
              controls
              className="aspect-video w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
