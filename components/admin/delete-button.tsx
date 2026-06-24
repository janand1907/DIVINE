'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  href: string;
  /** Redirect target after successful deletion (router.push). */
  redirectTo?: string;
  label?: string;
}

/**
 * Client-side delete control. Renders as a destructive form posting to the
 * given API href. Confirms via window.confirm before submitting and refreshes
 * the router cache (optionally navigating to `redirectTo`).
 */
export function DeleteButton({ href, redirectTo, label }: DeleteButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm('Delete this item? This action cannot be undone.')) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(href, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        const { toast } = await import('sonner');
        toast.error(j?.error ?? 'Delete failed');
        setSubmitting(false);
        return;
      }
      const { useRouter } = await import('next/navigation');
      const router = useRouter();
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      const { toast } = await import('sonner');
      toast.error('Network error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} aria-label={label ?? 'Delete'}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={submitting}
        aria-label={label ?? 'Delete'}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
