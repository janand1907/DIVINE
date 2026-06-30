import * as React from 'react';
import { cn } from '@/lib/utils';

type IconWrapVariant = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
type IconWrapSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: IconWrapVariant;
  size?: IconWrapSize;
  children: React.ReactNode;
}

const variantClasses: Record<IconWrapVariant, string> = {
  primary:   'bg-primary/10 text-primary hover:bg-primary/18',
  secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/18',
  muted:     'bg-muted text-muted-foreground hover:bg-border',
  success:   'bg-[rgb(var(--color-success-100))] text-[rgb(var(--color-success-500))]',
  warning:   'bg-[rgb(var(--color-warning-100))] text-[rgb(var(--color-warning-500))]',
  error:     'bg-[rgb(var(--color-error-100))] text-[rgb(var(--color-error-400))]',
};

const sizeClasses: Record<IconWrapSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-[72px] h-[72px]',
};

const iconSizeClasses: Record<IconWrapSize, string> = {
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-5 [&>svg]:h-5',
  lg: '[&>svg]:w-6 [&>svg]:h-6',
  xl: '[&>svg]:w-8 [&>svg]:h-8',
};

const IconWrapper = React.forwardRef<HTMLDivElement, IconWrapperProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full shrink-0',
          'transition-colors duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          variantClasses[variant],
          sizeClasses[size],
          iconSizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
IconWrapper.displayName = 'IconWrapper';

export { IconWrapper };
export type { IconWrapVariant, IconWrapSize };
