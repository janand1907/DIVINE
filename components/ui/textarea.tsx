import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-[var(--radius-md)] border-[1.5px] border-input bg-white px-4 py-3 text-sm text-foreground',
          'placeholder:text-muted-foreground/65',
          'transition-[border-color,box-shadow] duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'hover:border-primary/45',
          'focus-visible:outline-none focus-visible:border-primary/70 focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb)/0.10)]',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
          'resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
