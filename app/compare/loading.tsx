import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="container mx-auto py-10">
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="h-6 w-full max-w-2xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full max-w-xl" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
}
