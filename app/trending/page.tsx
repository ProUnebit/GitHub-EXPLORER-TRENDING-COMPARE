import { Suspense } from 'react';
import { TrendingFilters } from './_components/TrendingFilters';
import { TrendingList } from './_components/TrendingList';
import { TrendingListSkeleton } from './_components/TrendingListSkeleton';
import { Flame } from 'lucide-react'

export const metadata = {
    title: 'Trending Repositories - GitHub Explorer',
    description: 'Discover trending repositories on GitHub',
};

type TrendingPageProps = {
    searchParams: Promise<{
        since?: 'daily' | 'weekly' | 'monthly';
        language?: string;
    }>;
};

export default async function TrendingPage({
    searchParams,
}: TrendingPageProps) {
    const params = await searchParams;
    const since = params.since || 'weekly';
    const language = params.language;

    // Уникальный key для Suspense
    // При изменении фильтров → key меняется → skeleton показывается
    const suspenseKey = `${since}-${language || 'all'}`;

    return (
        <div className="container mx-auto py-6 sm:py-10">
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="space-y-2 px-4 sm:px-0">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
                        <span className='text-teal-600 dark:text-amber-300/80'>Trending Repositories</span>
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Discover what the GitHub community is most excited about
                        today
                    </p>
                </div>

                {/* Filters - Client Component */}
                <TrendingFilters
                    currentSince={since}
                    currentLanguage={language}
                />

                {/* Results - Server Component with Suspense */}
                <Suspense key={suspenseKey} fallback={<TrendingListSkeleton />}>
                    <TrendingList since={since} language={language} />
                </Suspense>
            </div>
        </div>
    );
}
