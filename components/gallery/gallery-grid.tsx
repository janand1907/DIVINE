'use client';

import { useState, useCallback, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import type { GalleryItemRow } from '@/types/database';

export interface GalleryGridProps {
  items: GalleryItemRow[];
}

type FilterCategory = 'all' | 'divine' | 'domestic' | 'international';

const filterOptions: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'divine', label: 'Divine' },
  { key: 'domestic', label: 'Domestic' },
  { key: 'international', label: 'International' },
];

export function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === 'all'
      ? items
      : items.filter((item) => (item.category ?? '').toLowerCase() === filter);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => {
          if (prev === null) return null;
          return (prev + 1) % filtered.length;
        });
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => {
          if (prev === null) return null;
          return (prev - 1 + filtered.length) % filtered.length;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filtered.length, closeLightbox]);

  const activeItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const activeIndex = lightboxIndex ?? 0;

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filterOptions.map((opt) => {
          const count =
            opt.key === 'all'
              ? items.length
              : items.filter((item) => (item.category ?? '').toLowerCase() === opt.key).length;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFilter(opt.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                filter === opt.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {opt.label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
          <p className="text-muted-foreground">
            No images in this category yet. Try a different filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Open ${item.title} in lightbox`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <p className="line-clamp-2 text-left text-sm font-medium text-white">
                  {item.title}
                </p>
              </div>
              {item.category && (
                <span className="absolute left-2 top-2 rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground">
                  {item.category}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close lightbox"
          >
            <XIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === null ? null : (prev - 1 + filtered.length) % filtered.length
              );
            }}
            className="absolute left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === null ? null : (prev + 1) % filtered.length
              );
            }}
            className="absolute right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next image"
          >
            ›
          </button>

          <figure
            className="max-h-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.image_url}
              alt={activeItem.title}
              className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center">
              <p className="font-medium text-white">{activeItem.title}</p>
              <p className="text-sm text-white/60">
                {activeIndex + 1} / {filtered.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

export default GalleryGrid;
