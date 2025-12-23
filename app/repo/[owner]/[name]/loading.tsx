// app/repo/[owner]/[name]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
    return (
        <div className="container mx-auto space-y-8 py-8">
            {/* Back Button - показываем сразу */}
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to search</span>
            </div>

            {/* Header - точная копия реального layout */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-3 rounded-full" />
                            <Skeleton className="h-4 w-16 " />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>

                <Skeleton className="h-5 w-full max-w-2xl" />

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-20" />
                    ))}
                </div>

                <div className="flex gap-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                </div>
            </div>

            {/* Stats - точная копия */}
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

            {/* Остальные секции */}
            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardContent className="p-6 ">
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
