import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================
// REPO SKELETON - Loading States
// ============================================
// Skeleton screens для разных секций
//
// Паттерн: Content-aware skeletons
// - Каждый skeleton повторяет структуру реального контента
// - Пользователь понимает что грузится
// - Снижает perceived loading time
//
// Архитектура:
// - Namespace pattern (RepoSkeleton.Chart, RepoSkeleton.Contributors)
// - Переиспользуемые компоненты
// - Легко добавлять новые варианты

export const RepoSkeleton = {
    // ============================================
    // CHART SKELETON
    // ============================================
    Chart: function ChartSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Круглый график */}
                        <div className="flex justify-center">
                            <Skeleton className="h-48 w-48 rounded-full" />
                        </div>

                        {/* Легенда */}
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    },

    // ============================================
    // CONTRIBUTORS SKELETON
    // ============================================
    Contributors: function ContributorsSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    {/* Avatar */}
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                {/* Commits count */}
                                <div className="space-y-2 text-right">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    },

    // ============================================
    // COMMITS SKELETON
    // ============================================
    Commits: function CommitsSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                            >
                                {/* Icon */}
                                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    {/* Message */}
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />

                                    {/* Author & time */}
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>

                                    {/* SHA */}
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    },

    // ============================================
    // ISSUES ANALYTICS SKELETON
    // ============================================
    IssuesAnalytics: function IssuesAnalyticsSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="bg-gradient-to-br from-background to-muted/20">
                                <CardContent className="p-4 sm:p-6">
                                    <Skeleton className="mb-2 h-5 w-5" />
                                    <Skeleton className="mb-1 h-8 w-16" />
                                    <Skeleton className="mb-1 h-4 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Timeline Chart */}
                    <div>
                        <Skeleton className="mb-3 h-4 w-48" />
                        <Skeleton className="h-64 w-full" />
                    </div>

                    {/* Grid: Labels + Top Issues */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Labels */}
                        <div>
                            <Skeleton className="mb-3 h-4 w-24" />
                            <Skeleton className="h-64 w-full" />
                        </div>

                        {/* Top Issues */}
                        <div>
                            <Skeleton className="mb-3 h-4 w-28" />
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border bg-card p-3"
                                    >
                                        <div className="mb-2 flex items-start gap-2">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-4 flex-1" />
                                        </div>
                                        <div className="mb-2 flex gap-1">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-3 w-12" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    },
};
