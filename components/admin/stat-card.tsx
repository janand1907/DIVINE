import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  accent?: 'primary' | 'secondary' | 'warning' | 'success' | 'default';
}

const accentMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-primary/10 text-primary',
  default: 'bg-accent text-accent-foreground',
} as const;

export function StatCard({ title, value, icon, accent = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-brand">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full', accentMap[accent])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
