import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const RepoSkeleton = {
    Chart: function ChartSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-48 w-48 rounded-full" />
                        </div>
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
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
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
                                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />

                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>

                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    },

    IssuesAnalytics: function IssuesAnalyticsSkeleton() {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="bg-linear-to-br from-background to-muted/20">
                                <CardContent className="p-4 sm:p-6">
                                    <Skeleton className="mb-2 h-5 w-5" />
                                    <Skeleton className="mb-1 h-8 w-16" />
                                    <Skeleton className="mb-1 h-4 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div>
                        <Skeleton className="mb-3 h-4 w-48" />
                        <Skeleton className="h-64 w-full" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <Skeleton className="mb-3 h-4 w-24" />
                            <Skeleton className="h-64 w-full" />
                        </div>

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
