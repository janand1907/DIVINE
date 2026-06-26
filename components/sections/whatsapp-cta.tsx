interface Props {
  config: Record<string, unknown>;
}

export function WhatsappCta({ config }: Props) {
  const heading = (config.heading as string) || 'Need Help? Chat with us!';
  const messageTemplate = (config.message_template as string) || 'Hi, I need help with my travel booking.';
  const buttonText = (config.button_text as string) || 'Chat on WhatsApp';
  const background = (config.background as string) || 'default';
  const phone = '919876543210';

  const bgClass = background === 'green' ? 'bg-[#25D366]/10' : 'bg-background';

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container-brand text-center">
        <h2 className="font-heading text-xl font-bold text-foreground">{heading}</h2>
        <a
          href={`https://wa.me/${phone}?text=${encodeURIComponent(messageTemplate)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#20bd5a]"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
