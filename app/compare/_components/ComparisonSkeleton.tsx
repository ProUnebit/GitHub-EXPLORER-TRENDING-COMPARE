import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// ============================================
// COMPARISON SKELETON
// ============================================
export function ComparisonSkeleton() {
    return (
        <div className="space-y-8">
            {/* Table Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Header row */}
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                        {/* Data rows */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-12 w-32" />
                                <Skeleton className="h-12 flex-1" />
                                <Skeleton className="h-12 flex-1" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts Skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
