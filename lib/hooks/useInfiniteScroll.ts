import { useState, useCallback, useRef, useEffect } from 'react';
import { searchRepositoriesClient } from '@/lib/github/api';
import type { GitHubRepo } from '@/lib/github/types';
import { toast } from 'sonner';

// ============================================
// USE INFINITE SCROLL HOOK
// ============================================
// Custom hook для управления infinite scroll логикой
//
// Ответственность:
// - Управление состоянием (repos, page, loading, hasMore)
// - Загрузка следующей страницы
// - Intersection Observer для автоподгрузки
// - Error handling
// - Дедупликация репозиториев
//
// Тестируемость:
// - Изолированная логика
// - Легко мокировать API
// - Можно unit-тестировать

type UseInfiniteScrollProps = {
    initialRepos: GitHubRepo[];
    query: string;
    sort?: string;
    totalCount: number;
    initialPerPage?: number;
};

type UseInfiniteScrollReturn = {
    repos: GitHubRepo[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    perPage: number;
    error: string | null;
    loadMore: () => Promise<void>;
    changePerPage: (newPerPage: number) => void;
    observerTarget: React.RefObject<HTMLDivElement | null>;
};

// ============================================
// HELPER: Deduplicate Repos
// ============================================
// GitHub API иногда возвращает дубликаты на разных страницах
// Фильтруем по уникальному id
function deduplicateRepos(repos: GitHubRepo[]): GitHubRepo[] {
    const seen = new Set<number>();
    return repos.filter((repo) => {
        if (seen.has(repo.id)) {
            return false;
        }
        seen.add(repo.id);
        return true;
    });
}

export function useInfiniteScroll({
    initialRepos,
    query,
    sort = 'stars',
    totalCount,
    initialPerPage = 30,
}: UseInfiniteScrollProps): UseInfiniteScrollReturn {
    // ============================================
    // STATE
    // ============================================
    const [repos, setRepos] = useState<GitHubRepo[]>(
        deduplicateRepos(initialRepos)
    );
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Вычисляем hasMore на основе текущего количества
    const hasMore = repos.length < totalCount;

    // Ref для Intersection Observer
    const observerTarget = useRef<HTMLDivElement>(null);

    // ============================================
    // LOAD MORE FUNCTION
    // ============================================
    // Загружает следующую страницу и добавляет к существующим
    const loadMore = useCallback(async () => {
        // Защита от дублирующихся запросов
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        setError(null);

        try {
            const nextPage = page + 1;

            const data = await searchRepositoriesClient({
                q: query,
                sort: sort as 'stars' | 'forks' | 'updated',
                order: 'desc',
                per_page: perPage,
                page: nextPage,
            });

            // Добавляем новые репозитории к существующим с дедупликацией
            setRepos((prev) => {
                const combined = [...prev, ...data.items];
                return deduplicateRepos(combined);
            });
            setPage(nextPage);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to load more repositories';
            setError(message);
            toast.error('Load Error', { description: message });
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, page, query, sort, perPage]);

    // ============================================
    // CHANGE PER PAGE FUNCTION
    // ============================================
    // При изменении per_page:
    // 1. Сбрасываем на первую страницу
    // 2. Очищаем репозитории
    // 3. Загружаем первую страницу заново
    const changePerPage = useCallback(
        async (newPerPage: number) => {
            if (newPerPage === perPage) return;

            setPerPage(newPerPage);
            setPage(1);
            setRepos([]); // Полная очистка
            setIsLoading(true);
            setError(null);

            try {
                const data = await searchRepositoriesClient({
                    q: query,
                    sort: sort as 'stars' | 'forks' | 'updated',
                    order: 'desc',
                    per_page: newPerPage,
                    page: 1,
                });

                setRepos(deduplicateRepos(data.items));

                // Скроллим наверх для лучшего UX
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : 'Failed to change page size';
                setError(message);
                toast.error('Error', { description: message });
            } finally {
                setIsLoading(false);
            }
        },
        [perPage, query, sort]
    );

    // ============================================
    // INTERSECTION OBSERVER
    // ============================================
    // Автоматически загружает следующую страницу при скролле
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Если элемент виден и есть ещё данные
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            {
                // Триггер на 300px до конца
                rootMargin: '300px',
                threshold: 0.1,
            }
        );

        observer.observe(target);

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [hasMore, isLoading, loadMore]);

    return {
        repos,
        page,
        hasMore,
        isLoading,
        perPage,
        error,
        loadMore,
        changePerPage,
        observerTarget,
    };
}
