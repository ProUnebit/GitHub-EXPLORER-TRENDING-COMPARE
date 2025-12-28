import { getTrendingRepositories } from '@/lib/github/api';
import { TrendingCard } from './TrendingCard';
import { TrendingExportButton } from './TrendingExportButton';

// ============================================
// TRENDING LIST - Server Component
// ============================================
// Фетчит данные на сервере
// Next.js автоматически кеширует результат
//
// Caching strategy:
// - Daily: 30 минут
// - Weekly: 1 час
// - Monthly: 6 часов

type TrendingListProps = {
    since: 'daily' | 'weekly' | 'monthly';
    language?: string;
};

export async function TrendingList({ since, language }: TrendingListProps) {
    // Fetch trending repositories
    const data = await getTrendingRepositories(language, since);

    // Edge case: No results
    if (data.items.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No trending repositories found
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Try different filters
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {/* Results count */}
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm font-semibold">
                        <span className="text-teal-600 font-bold">{data.items.length}</span> trending{' '}
                        <span className="text-teal-600 font-bold">{language ? `${language} ` : ''}</span> repositories
                    </p>
                </div>

                {/* Export Button */}
                <div className="flex justify-end">
                    <TrendingExportButton
                        repos={data.items}
                        since={since}
                        language={language}
                    />
                </div>
            </div>


            {/* Repository List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.items.map((repo, index) => (
                    <TrendingCard key={repo.id} repo={repo} rank={index + 1} />
                ))}
            </div>
        </div>
    );
}
