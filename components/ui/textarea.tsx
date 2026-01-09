import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                data-slot="textarea"
                className={cn(
                    // Base styles
                    'border-input flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none',
                    // Dark mode
                    'dark:bg-input/30',
                    // Placeholder
                    'placeholder:text-muted-foreground',
                    // Selection
                    'selection:bg-primary selection:text-primary-foreground',
                    // Focus
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    // Disabled
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    // Invalid/Error state
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    // Mobile text size
                    'md:text-sm',
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
