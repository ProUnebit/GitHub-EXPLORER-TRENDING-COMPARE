'use client';

import { LoaderPinwheel } from 'lucide-react';
import { RepoCard } from './RepoCard';
import { PerPageSelector } from './PerPageSelector';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { Button } from '@/components/ui/button';
import type { GitHubRepo } from '@/lib/github/types';

// ============================================
// SEARCH RESULTS CLIENT - Client Component
// ============================================
// Wrapper для управления infinite scroll
//
// Архитектура:
// - Получает initial data от Server Component
// - Управляет client-side подгрузкой через hook
// - Отображает repos + loading states
//
// Почему Client Component:
// - Нужен useState для управления списком
// - Intersection Observer (DOM API)
// - Динамическая подгрузка данных
//
// RSC Pattern:
// Server Component (SearchResults) → загружает первую страницу
// Client Component (этот) → управляет последующими страницами

type SearchResultsClientProps = {
    initialRepos: GitHubRepo[];
    query: string;
    sort?: string;
    totalCount: number;
};

export function SearchResultsClient({
    initialRepos,
    query,
    sort,
    totalCount,
}: SearchResultsClientProps) {
    // ============================================
    // INFINITE SCROLL HOOK
    // ============================================
    const {
        repos,
        hasMore,
        isLoading,
        perPage,
        error,
        loadMore,
        changePerPage,
        observerTarget,
    } = useInfiniteScroll({
        initialRepos,
        query,
        sort,
        totalCount,
        initialPerPage: 30,
    });

    return (
        <div className="space-y-4">
            {/* ============================================
                HEADER - Результаты + Per Page Selector
                ============================================ */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-muted-foreground text-sm font-semibold">
                    Found{' '}
                    <span className="text-teal-600 font-bold">
                        {totalCount.toLocaleString()}
                    </span>{' '}
                    repositories
                    {repos.length > 0 && (
                        <span className="text-muted-foreground ml-2">
                            (showing <span className='text-teal-600'>{repos.length}</span>)
                        </span>
                    )}
                </p>

                <PerPageSelector
                    value={perPage}
                    onChange={changePerPage}
                    disabled={isLoading}
                />
            </div>

            {/* ============================================
                REPOSITORY GRID
                ============================================ */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>

            {/* ============================================
                LOADING STATE
                ============================================ */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <LoaderPinwheel className="h-8 w-8 animate-spin text-teal-600 dark:text-amber-300/80" />
                    <span className="ml-3 text-muted-foreground">
                        Loading more repositories...
                    </span>
                </div>
            )}

            {/* ============================================
                INTERSECTION OBSERVER TRIGGER
                ============================================ */}
            {hasMore && !isLoading && (
                <div ref={observerTarget} className="py-4">
                    {/* Этот div используется Intersection Observer'ом
                        Когда пользователь доскроллит до него → loadMore() */}
                </div>
            )}

            {/* ============================================
                LOAD MORE BUTTON (Fallback)
                ============================================ */}
            {hasMore && !isLoading && (
                <div className="flex justify-center py-8">
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px]"
                    >
                        Load More
                    </Button>
                </div>
            )}

            {/* ============================================
                NO MORE RESULTS
                ============================================ */}
            {!hasMore && repos.length > 0 && (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                        All {totalCount.toLocaleString()} repositories loaded
                    </p>
                </div>
            )}

            {/* ============================================
                ERROR STATE
                ============================================ */}
            {error && (
                <div className="bg-destructive/10 border-destructive rounded-lg border p-4 text-center">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
}
