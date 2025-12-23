import { searchRepositories } from '@/lib/github/api';
import type { SearchParams } from '@/lib/github/types';
import { RepoCard } from './RepoCard';

// ============================================
// SEARCH RESULTS COMPONENT
// ============================================
// Отвечает ТОЛЬКО за отображение результатов поиска
//
// Почему БЕЗ try/catch:
// - React не ловит ошибки рендера через try/catch
// - Для ошибок используем error.tsx (Error Boundary)
// - Если fetch падает → error.tsx автоматически ловит
//
// Архитектурное решение:
// - throw error → Next.js передает в error.tsx
// - error.tsx показывает UI ошибки
// - Пользователь видит fallback вместо crash

type SearchResultsProps = {
    query: string;
    sort?: string;
};

export async function SearchResults({ query, sort }: SearchResultsProps) {
    // ============================================
    // DATA FETCHING - БЕЗ try/catch
    // ============================================
    // Если fetch упадет → error автоматически прокинется
    // Next.js поймает через error.tsx

    const searchParams: SearchParams = {
        q: query,
        sort: (sort as 'stars' | 'forks' | 'updated') || 'stars',
        order: 'desc',
        per_page: 30,
    };

    // Если ошибка → throw автоматически
    const data = await searchRepositories(searchParams);

    // ============================================
    // EDGE CASE: No results
    // ============================================
    if (data.total_count === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No repositories found for &quot;{query}&quot;
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Try different keywords or check spelling
                </p>
            </div>
        );
    }

    // ============================================
    // SUCCESS: Render results
    // ============================================
    return (
        <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    Found {data.total_count.toLocaleString()} repositories
                </p>
            </div>

            {/* Repository Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.items.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}
