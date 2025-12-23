import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
    return (
        <div className="container mx-auto py-10">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="h-6 w-full max-w-2xl" />
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-9 w-24"
                            />
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Card key={i} className="flex h-full flex-col">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
