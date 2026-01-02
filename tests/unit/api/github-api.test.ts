import { describe, it, expect } from 'vitest';
import { searchRepositoriesClient, getRepository } from '@/lib/github/api';

describe('GitHub API Client', () => {
    describe('searchRepositoriesClient', () => {
        it('fetches repositories successfully', async () => {
            const result = await searchRepositoriesClient({
                q: 'react',
                per_page: 30,
                page: 1,
            });

            expect(result.total_count).toBe(2);
            expect(result.items).toHaveLength(2);
            expect(result.items[0].name).toBe('react');
        });

        it('handles pagination', async () => {
            const result = await searchRepositoriesClient({
                q: 'react',
                per_page: 30,
                page: 2,
            });

            expect(result.items).toHaveLength(2);
            expect(result.items[0].name).toBe('angular');
        });

        it('handles empty results', async () => {
            const result = await searchRepositoriesClient({
                q: 'notfound',
                per_page: 30,
                page: 1,
            });

            expect(result.total_count).toBe(0);
            expect(result.items).toHaveLength(0);
        });

        it('throws error on API failure', async () => {
            await expect(
                searchRepositoriesClient({
                    q: 'error',
                    per_page: 30,
                    page: 1,
                })
            ).rejects.toThrow();
        });

        it('applies language filter correctly', async () => {
            const result = await searchRepositoriesClient({
                q: 'react language:javascript',
                per_page: 30,
                page: 1,
            });

            expect(result.items[0].language).toBe('JavaScript');
        });
    });

    describe('getRepository', () => {
        it('fetches single repository', async () => {
            const result = await getRepository('facebook', 'react');

            expect(result.name).toBe('react');
            expect(result.owner.login).toBe('facebook');
        });

        it('throws error for non-existent repo', async () => {
            await expect(
                getRepository('facebook', 'notfound')
            ).rejects.toThrow();
        });
    });
});
