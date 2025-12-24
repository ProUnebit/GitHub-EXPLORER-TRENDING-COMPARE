import { Suspense } from 'react';
import { TrendingFilters } from './_components/TrendingFilters';
import { TrendingList } from './_components/TrendingList';
import { TrendingListSkeleton } from './_components/TrendingListSkeleton';
import { Flame } from 'lucide-react'

// ============================================
// METADATA
// ============================================
export const metadata = {
    title: 'Trending Repositories - GitHub Explorer',
    description: 'Discover trending repositories on GitHub',
};

// ============================================
// TRENDING PAGE
// ============================================
// Паттерн: URL-driven state
// - Фильтры изменяют URL
// - Server читает URL и фетчит данные
// - key prop для сброса Suspense при изменении фильтров

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

    // Генерируем уникальный key для Suspense
    // При изменении фильтров → key меняется → skeleton показывается
    const suspenseKey = `${since}-${language || 'all'}`;

    return (
        <div className="container mx-auto py-10">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center">
                        <Flame className="inline-block mr-2 w-12 h-12 text-orange-600" />
                        <span className='text-teal-600'>Trending Repositories</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
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
