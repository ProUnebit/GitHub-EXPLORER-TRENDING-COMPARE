import { searchRepositories } from '@/lib/github/api';
import type { SearchParams } from '@/lib/github/types';
import { SearchResultsClient } from './SearchResultsClient';

type SearchResultsProps = {
    query: string;
    sort?: string;
    language?: string; // ← Новый параметр
    minStars?: string; // ← Новый параметр
};

export async function SearchResults({
    query,
    sort,
    language,
    minStars,
}: SearchResultsProps) {
    // ============================================
    // BUILD QUERY WITH FILTERS
    // ============================================
    // GitHub API использует специальный синтаксис в параметре q

    let searchQuery = query;

    // Добавляем фильтр по языку
    if (language) {
        searchQuery += ` language:${language}`;
    }

    // Добавляем фильтр по звёздам
    if (minStars && parseInt(minStars) > 0) {
        searchQuery += ` stars:>=${minStars}`;
    }

    const searchParams: SearchParams = {
        q: searchQuery, // ← Теперь включает фильтры
        sort: (sort as 'stars' | 'forks' | 'updated') || 'stars',
        order: 'desc',
        per_page: 30,
        page: 1,
    };

    const data = await searchRepositories(searchParams);

    // Edge case: нет результатов
    if (data.total_count === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No repositories found for &quot;
                    <span className="font-semibold text-teal-600">{query}</span>
                    &quot;
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Try different keywords or adjust filters
                </p>
            </div>
        );
    }

    // Передаём в Client Component (фильтры нужны для infinite scroll)
    return (
        <SearchResultsClient
            initialRepos={data.items}
            query={searchQuery} // ← Полный query с фильтрами
            sort={sort}
            totalCount={data.total_count}
        />
    );
}
