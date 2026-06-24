'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, Trash2, Check } from 'lucide-react';
import type { MediaAssetRow } from '@/types/database';

interface MediaGridProps {
  items: MediaAssetRow[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = async (asset: MediaAssetRow) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      toast.success('URL copied');
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error('Could not copy');
    }
  };

  const onDelete = async (asset: MediaAssetRow) => {
    if (!window.confirm(`Delete “${asset.filename}”?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error ?? 'Delete failed');
        return;
      }
      toast.success('Media deleted');
      router.refresh();
    } catch {
      toast.error('Network error');
    }
  };

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
        No media assets yet. Click “Upload” to add one by URL.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((asset) => (
        <figure
          key={asset.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-brand"
        >
          <div className="relative aspect-square overflow-hidden bg-accent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.alt_text ?? asset.filename}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = '0.2';
              }}
            />
            <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-3 opacity-0 transition group-hover:opacity-100">
              <div className="flex w-full items-center justify-between">
                <button
                  type="button"
                  onClick={() => copyUrl(asset)}
                  className="rounded-md bg-background/90 p-2 text-foreground transition hover:bg-background"
                  aria-label="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(asset)}
                  className="rounded-md bg-background/90 p-2 text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </figcaption>
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-medium text-foreground" title={asset.filename}>
              {asset.filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {asset.size_bytes ? formatBytes(asset.size_bytes) : asset.mime_type ?? 'image'}
            </p>
            {asset.tags.length > 0 && (
              <p className="mt-1 truncate text-xs text-muted-foreground">#{asset.tags.join(' #')}</p>
            )}
          </div>
        </figure>
      ))}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
