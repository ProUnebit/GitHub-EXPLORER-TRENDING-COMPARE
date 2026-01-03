'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { LoaderPinwheel } from 'lucide-react';
import { RepoCard } from './RepoCard';
import { PerPageSelector } from './PerPageSelector';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { Button } from '@/components/ui/button';
import type { GitHubRepo } from '@/lib/github/types';
import { useRef, useEffect } from 'react';

type SearchResultsClientProps = {
    initialRepos: GitHubRepo[];
    query: string;
    sort?: string;
    totalCount: number;
};

// ============================================
// ANIMATION VARIANTS
// ============================================
// Для initial render (stagger effect)
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // 50ms между карточками
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Для новых карточек (infinite scroll) - простой fade-in
const newItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

export function SearchResultsClient({
    initialRepos,
    query,
    sort,
    totalCount,
}: SearchResultsClientProps) {
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

    // ============================================
    // TRACK INITIAL COUNT
    // ============================================
    // Отслеживаем количество initial repos
    const initialCountRef = useRef(initialRepos.length);

    // Обновляем при смене query или perPage (новый поиск = новый initial)
    useEffect(() => {
        initialCountRef.current = repos.length;
    }, [query, perPage ]); // ← Важно: сбрасываем при изменении

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-muted-foreground text-sm font-semibold">
                    Found{' '}
                    <span className="font-bold text-teal-600">
                        {totalCount.toLocaleString()}
                    </span>{' '}
                    repositories
                    {repos.length > 0 && (
                        <span className="text-muted-foreground ml-2">
                            (showing{' '}
                            <span className="text-teal-600">
                                {repos.length}
                            </span>
                            )
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
                {/* INITIAL REPOS - STAGGER ANIMATION */}
                <motion.div
                    className="contents" // ← contents = дети вставляются напрямую в grid
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={`${query}-${perPage}`} // ← Перезапуск при query/perPage
                >
                    {/* eslint-disable-next-line react-hooks/refs */}
                    {repos.slice(0, initialCountRef.current).map((repo) => (
                        <motion.div key={repo.id} variants={itemVariants as Variants}>
                            <RepoCard repo={repo} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* NEW REPOS (infinite scroll) - SIMPLE FADE-IN */}
                <AnimatePresence>
                    {/* eslint-disable-next-line react-hooks/refs */}
                    {repos.slice(initialCountRef.current).map((repo) => (
                        <motion.div
                            key={repo.id}
                            variants={newItemVariants  as Variants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <RepoCard repo={repo} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
                <motion.div
                    className="flex items-center justify-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <LoaderPinwheel className="h-8 w-8 animate-spin text-teal-600 dark:text-amber-300/80" />
                    <span className="text-muted-foreground ml-3">
                        Loading more repositories...
                    </span>
                </motion.div>
            )}

            {/* INTERSECTION OBSERVER TRIGGER */}
            {hasMore && !isLoading && (
                <div ref={observerTarget} className="py-4" />
            )}

            {/* LOAD MORE BUTTON */}
            {hasMore && !isLoading && (
                <div className="flex justify-center py-8">
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        size="lg"
                        className="min-w-50"
                    >
                        Load More
                    </Button>
                </div>
            )}

            {/* NO MORE RESULTS */}
            {!hasMore && repos.length > 0 && (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                        All {totalCount.toLocaleString()} repositories loaded
                    </p>
                </div>
            )}

            {/* ERROR STATE */}
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
