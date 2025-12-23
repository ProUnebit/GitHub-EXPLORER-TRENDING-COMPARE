import { cn } from '@/lib/utils/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md border border-teal-400/50 bg-teal-200/80',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };