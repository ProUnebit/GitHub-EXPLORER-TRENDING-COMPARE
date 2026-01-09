import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { mockRepo, mockRepo2 } from '@/tests/mocks/fixtures';

// useInfiniteScroll HOOK TESTS

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

    // INITIALIZATION TESTS

    describe('initialization', () => {
        it('initializes with correct state', () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            expect(result.current.repos).toHaveLength(2);
            expect(result.current.page).toBe(1);
            expect(result.current.perPage).toBe(30);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('calculates hasMore correctly when more data exists', () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 100, // 2 repos out of 100
                })
            );

            expect(result.current.hasMore).toBe(true);
        });

        it('calculates hasMore correctly when all data loaded', () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 2, // 2 repos out of 2
                })
            );

            expect(result.current.hasMore).toBe(false);
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

        it('provides observerTarget ref', () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            expect(result.current.observerTarget).toBeDefined();
            expect(result.current.observerTarget.current).toBe(null);
        });
    });

    // LOAD MORE TESTS

    describe('loadMore', () => {
        it('loads next page successfully', async () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            expect(result.current.repos).toHaveLength(2);
            expect(result.current.page).toBe(1);

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
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            act(() => {
                result.current.loadMore();
            });

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('does not load if already loading', async () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            // First call
            act(() => {
                result.current.loadMore();
            });

            const initialPage = result.current.page;

            // Second call while first is loading
            await act(async () => {
                await result.current.loadMore();
            });

            await waitFor(() => {
                expect(result.current.page).toBe(initialPage + 1);
            });
        });

        it('does not load if hasMore is false', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    totalCount: 2, // All loaded
                })
            );

            const initialLength = result.current.repos.length;

            await act(async () => {
                await result.current.loadMore();
            });

            expect(result.current.repos.length).toBe(initialLength);
        });

        it('handles API errors', async () => {
            const { result } = renderHook(() =>
                useInfiniteScroll({
                    ...defaultProps,
                    query: 'error', // Triggers error in MSW
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
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            await act(async () => {
                await result.current.loadMore();
            });

            await waitFor(() => {
                const ids = result.current.repos.map((r) => r.id);
                const uniqueIds = new Set(ids);
                expect(ids.length).toBe(uniqueIds.size);
            });
        });
    });

    // CHANGE PER PAGE TESTS

    describe('changePerPage', () => {
        it('resets to first page', async () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            // Load second page first
            await act(async () => {
                await result.current.loadMore();
            });

            expect(result.current.page).toBe(2);

            // Change per page
            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                expect(result.current.page).toBe(1);
                expect(result.current.perPage).toBe(50);
            });
        });

        it('clears repos and reloads', async () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            await act(async () => {
                await result.current.changePerPage(50);
            });

            await waitFor(() => {
                expect(result.current.repos.length).toBeGreaterThan(0);
                expect(result.current.isLoading).toBe(false);
            });
        });

        it('scrolls to top on change', async () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

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
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            const initialPage = result.current.page;

            await act(async () => {
                await result.current.changePerPage(30); // Same as default
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

    // RETURNED VALUES TESTS

    describe('returned values', () => {
        it('returns all expected properties', () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));

            expect(result.current).toHaveProperty('repos');
            expect(result.current).toHaveProperty('page');
            expect(result.current).toHaveProperty('hasMore');
            expect(result.current).toHaveProperty('isLoading');
            expect(result.current).toHaveProperty('perPage');
            expect(result.current).toHaveProperty('error');
            expect(result.current).toHaveProperty('loadMore');
            expect(result.current).toHaveProperty('changePerPage');
            expect(result.current).toHaveProperty('observerTarget');
        });

        it('loadMore is a function', () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));
            expect(typeof result.current.loadMore).toBe('function');
        });

        it('changePerPage is a function', () => {
            const { result } = renderHook(() => useInfiniteScroll(defaultProps));
            expect(typeof result.current.changePerPage).toBe('function');
        });
    });
});
