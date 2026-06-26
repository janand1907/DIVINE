'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  href: string;
  redirectTo?: string;
  label?: string;
}

export function DeleteButton({ href, redirectTo, label }: DeleteButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
        toast.error(j?.error ?? 'Delete failed');
        setSubmitting(false);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
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
