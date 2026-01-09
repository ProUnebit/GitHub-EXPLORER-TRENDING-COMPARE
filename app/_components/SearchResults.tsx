import { searchRepositories } from '@/lib/github/api';
import type { SearchParams } from '@/lib/github/types';
import { SearchResultsClient } from './SearchResultsClient';
import { buildSearchQuery } from '@/lib/utils/query-builder';

type SearchResultsProps = {
    query: string;
    sort?: string;
    language?: string;
    minStars?: string;
};

export async function SearchResults({
    query,
    sort,
    language,
    minStars,
}: SearchResultsProps) {
    const searchQuery = buildSearchQuery({ query, language, minStars });

    const searchParams: SearchParams = {
        q: searchQuery,
        sort: (sort as 'stars' | 'forks' | 'updated') || 'stars',
        order: 'desc',
        per_page: 30,
        page: 1,
    };

    const data = await searchRepositories(searchParams);

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

    return (
        <SearchResultsClient
            initialRepos={data.items}
            query={searchQuery}
            sort={sort}
            totalCount={data.total_count}
        />
    );
}
