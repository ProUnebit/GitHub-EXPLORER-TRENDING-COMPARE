// app/repo/[owner]/[name]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to search</span>
            </div>

            <div className="space-y-4">
                {/* Title + Star Button */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        {/* Repo name */}
                        <Skeleton className="h-10 w-64" />
                        {/* Owner + visibility */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-3 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    {/* Star button */}
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Description */}
                <Skeleton className="h-5 w-full max-w-2xl" />

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-20" />
                    ))}
                </div>

                {/* Links (Homepage, License, etc) */}
                <div className="flex flex-wrap gap-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                </div>
            </div>

            <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Health Score Card */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Overall Score */}
                            <div className="text-center">
                                <Skeleton className="mx-auto h-20 w-20 rounded-full" />
                                <Skeleton className="mx-auto mt-2 h-4 w-24" />
                            </div>

                            {/* Breakdown - 4 categories */}
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                        <Skeleton className="h-2 w-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Language Chart */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Pie Chart */}
                            <div className="flex justify-center">
                                <Skeleton className="h-48 w-48 rounded-full" />
                            </div>

                            {/* Legend */}
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

                {/* Dependency Analysis */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Total count */}
                            <div className="text-center">
                                <Skeleton className="mx-auto h-12 w-20" />
                                <Skeleton className="mx-auto mt-2 h-4 w-32" />
                            </div>

                            {/* Dependency list */}
                            <div className="space-y-3">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between"
                                    >
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                {/* Recent Commits */}
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
                                        {/* Commit message */}
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

                {/* Contributors List */}
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
            </div>
        </div>
    );
}
