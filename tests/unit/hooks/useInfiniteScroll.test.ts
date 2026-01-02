import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { mockRepo, mockRepo2 } from '@/tests/mocks/fixtures';

describe('useInfiniteScroll', () => {
    const initialRepos = [mockRepo, mockRepo2];
    const defaultProps = {
        initialRepos,
        query: 'react',
        sort: 'stars',
        totalCount: 100,
        initialPerPage: 30,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('initializes with correct state', () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            expect(result.current.repos).toHaveLength(2);
            expect(result.current.page).toBe(1);
            expect(result.current.perPage).toBe(30);
            expect(result.current.hasMore).toBe(true); // 2 < 100
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('deduplicates initial repos', () => {
            const duplicates = [mockRepo, mockRepo, mockRepo2];
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    initialRepos: duplicates,
                })
            );

            expect(result.current.repos).toHaveLength(2);
        });

        it('calculates hasMore correctly', () => {
            // Все загружено
            const { result: allLoaded } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 2, // Равно количеству repos
                })
            );
            expect(allLoaded.current.hasMore).toBe(false);

            // Есть ещё
            const { result: hasMore } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 100,
                })
            );
            expect(hasMore.current.hasMore).toBe(true);
        });
    });

    describe('loadMore', () => {
        it('loads next page successfully', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            expect(result.current.repos).toHaveLength(2);
            expect(result.current.page).toBe(1);

            // Загружаем следующую страницу
            await act(async () => {
                await result.current.loadMore();
            });

            await waitFor(() => {
                expect(result.current.repos.length).toBeGreaterThan(2);
                expect(result.current.page).toBe(2);
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('sets loading state during fetch', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            act(() => {
                result.current.loadMore();
            });

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('does not load if already loading', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            // Первый вызов
            act(() => {
                result.current.loadMore();
            });

            const initialPage = result.current.page;

            // Второй вызов пока первый не завершился
            await act(async () => {
                await result.current.loadMore();
            });

            // Страница не должна измениться дважды
            await waitFor(() => {
                expect(result.current.page).toBe(initialPage + 1);
            });
        });

        it('does not load if no more data', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 2, // hasMore = false
                })
            );

            const initialReposLength = result.current.repos.length;

            await act(async () => {
                await result.current.loadMore();
            });

            expect(result.current.repos.length).toBe(initialReposLength);
        });

        it('handles API errors', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    query: 'error', // Триггерит ошибку в MSW
                })
            );

            await act(async () => {
                await result.current.loadMore();
            });

            await waitFor(() => {
                expect(result.current.error).not.toBe(null);
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('deduplicates repos on load', async () => {
            // MSW возвращает репо с id:3, id:4
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            await act(async () => {
                await result.current.loadMore();
            });

            await waitFor(() => {
                const ids = result.current.repos.map((r) => r.id);
                const uniqueIds = new Set(ids);
                expect(ids.length).toBe(uniqueIds.size); // Все уникальные
            });
        });
    });

    describe('changePerPage', () => {
        it('resets to first page', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            // Загружаем вторую страницу
            await act(async () => {
                await result.current.loadMore();
            });

            expect(result.current.page).toBe(2);

            // Меняем per_page
            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                expect(result.current.page).toBe(1);
                expect(result.current.perPage).toBe(50);
            });
        });

        it('clears repos and reloads', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            const initialLength = result.current.repos.length;

            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                // Repos должны обновиться (новая загрузка)
                expect(result.current.repos.length).toBeGreaterThan(0);
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('scrolls to top on change', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                expect(window.scrollTo).toHaveBeenCalledWith({
                    top: 0,
                    behavior: 'smooth',
                });
            });
        });

        it('does not change if value is same', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            const initialPage = result.current.page;

            await act(async () => {
                await result.current.changePerPage(30); // Уже 30
            });

            expect(result.current.page).toBe(initialPage);
        });

        it('handles errors during change', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    query: 'error',
                })
            );

            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                expect(result.current.error).not.toBe(null);
            });
        });
    });

    describe('observerTarget', () => {
        it('provides ref object', () => {
            const { result } = renderHook(() =>
                useInfiniteScroll(defaultProps)
            );

            expect(result.current.observerTarget).toBeDefined();
            expect(result.current.observerTarget.current).toBe(null); // Не примонтирован
        });
    });
});
