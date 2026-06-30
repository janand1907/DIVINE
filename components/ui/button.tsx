import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader as Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground rounded-lg hover:brightness-110 hover:shadow-[0_8px_24px_rgba(var(--primary-rgb)/0.28)]',
        secondary:
          'bg-secondary text-secondary-foreground rounded-lg hover:brightness-110 hover:shadow-[0_8px_24px_rgba(var(--secondary-rgb)/0.28)]',
        outline:
          'border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-primary/10',
        'outline-secondary':
          'border-2 border-secondary text-secondary bg-transparent rounded-lg hover:bg-secondary/10',
        ghost:
          'bg-transparent text-foreground rounded-lg hover:bg-muted',
        destructive:
          'bg-destructive text-destructive-foreground rounded-lg hover:brightness-110',
        muted:
          'bg-muted text-muted-foreground rounded-lg hover:bg-border',
        link:
          'text-primary underline-offset-4 hover:underline h-auto p-0',
      },
      size: {
        sm:        'h-9 px-3.5 text-xs',
        default:   'h-11 px-6 text-sm',
        lg:        'h-12 px-8 text-base',
        xl:        'h-14 px-10 text-base',
        icon:      'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <button className={classes} ref={ref} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
