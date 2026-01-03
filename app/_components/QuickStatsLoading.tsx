import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================
// QUICK STATS LOADING SKELETON
// ============================================
// Показывается во время загрузки статистики

export function QuickStatsLoading() {
    return (
        <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-muted/50 border-none">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                        {/* Icon skeleton */}
                        <Skeleton className="mb-3 h-6 w-6 rounded-full" />

                        {/* Value skeleton */}
                        <Skeleton className="mb-1 h-9 w-16" />

                        {/* Label skeleton */}
                        <Skeleton className="mb-1 h-4 w-20" />

                        {/* Subtext skeleton */}
                        <Skeleton className="h-3 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
