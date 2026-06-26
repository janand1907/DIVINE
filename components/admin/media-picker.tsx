'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Image as ImageIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MediaAssetRow } from '@/types/database';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, asset: MediaAssetRow) => void;
}

export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data: MediaAssetRow[]) => {
        if (Array.isArray(data)) setAssets(data);
        else setAssets([]);
      })
      .catch(() => {
        toast.error('Failed to load media library');
        setAssets([]);
      })
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = search.trim()
    ? assets.filter(
        (a) =>
          a.filename.toLowerCase().includes(search.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      )
    : assets;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-5 w-5 text-primary" />
            Select Image
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 flex items-center gap-2 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search by filename or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 px-0"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No media found.</p>
              <p className="text-sm text-muted-foreground">
                Go to{' '}
                <a
                  href="/admin/media"
                  target="_blank"
                  className="text-primary hover:underline"
                  rel="noreferrer"
                >
                  Media Library
                </a>{' '}
                to upload images.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset.url, asset);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-accent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt_text || asset.filename}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                    <span className="text-white text-xs font-medium">Select</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
                    <p className="text-[10px] truncate leading-tight">
                      {asset.filename}
                    </p>
                    {asset.tags.length > 0 && (
                      <p className="text-[9px] text-white/70 truncate">
                        #{asset.tags[0]}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {filtered.length} image{filtered.length !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
