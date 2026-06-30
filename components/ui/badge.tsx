import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-[150ms] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25',
        secondary:
          'bg-secondary/15 text-secondary border border-secondary/20 hover:bg-secondary/25',
        destructive:
          'bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25',
        success:
          'bg-[rgb(var(--color-success-100))] text-[rgb(var(--color-success-500))] border border-[rgb(var(--color-success-200))]',
        warning:
          'bg-[rgb(var(--color-warning-100))] text-[rgb(var(--color-warning-500))] border border-[rgb(var(--color-warning-200))]',
        outline:
          'border border-border text-foreground bg-transparent',
        muted:
          'bg-muted text-muted-foreground border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
