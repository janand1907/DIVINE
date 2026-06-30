import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-[var(--radius-md)] border-[1.5px] border-input bg-white px-4 py-2.5 text-sm text-foreground',
          'placeholder:text-muted-foreground/65',
          'transition-[border-color,box-shadow] duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'hover:border-primary/45',
          'focus-visible:outline-none focus-visible:border-primary/70 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)]',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
