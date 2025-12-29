import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ============================================
// LABEL COMPONENT (Native HTML)
// ============================================

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                'select-none text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        />
    )
);

Label.displayName = 'Label';

export { Label };
