import { describe, it, expect } from 'vitest';
import {
    searchRepositoriesClient,
    getRepository,
    getContributors,
    getLanguages,
    getCommits,
} from '@/lib/github/api';

// ============================================
// GITHUB API CLIENT TESTS
// ============================================

describe('GitHub API Client', () => {
    // ============================================
    // searchRepositoriesClient TESTS
    // ============================================

    describe('searchRepositoriesClient', () => {
        it('fetches repositories successfully', async () => {
            const result = await searchRepositoriesClient({
                q: 'react',
                per_page: 30,
                page: 1,
            });

            expect(result.total_count).toBe(100);
            expect(result.items).toHaveLength(2);
            expect(result.items[0].name).toBe('react');
        });

        it('returns items array', async () => {
            const result = await searchRepositoriesClient({
                q: 'react',
            });

            expect(Array.isArray(result.items)).toBe(true);
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

        it('uses default values for optional params', async () => {
            const result = await searchRepositoriesClient({
                q: 'react',
            });

            expect(result).toBeDefined();
            expect(result.items).toBeDefined();
        });
    });

    // ============================================
    // getRepository TESTS
    // ============================================

    describe('getRepository', () => {
        it('fetches single repository', async () => {
            const result = await getRepository('facebook', 'react');

            expect(result.name).toBe('react');
            expect(result.owner.login).toBe('facebook');
        });

        it('returns complete repo data', async () => {
            const result = await getRepository('facebook', 'react');

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('full_name');
            expect(result).toHaveProperty('owner');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('stargazers_count');
            expect(result).toHaveProperty('forks_count');
        });

        it('throws error for non-existent repo', async () => {
            await expect(
                getRepository('facebook', 'notfound')
            ).rejects.toThrow();
        });

        it('throws error on server error', async () => {
            await expect(
                getRepository('error', 'repo')
            ).rejects.toThrow();
        });
    });

    // ============================================
    // getContributors TESTS
    // ============================================

    describe('getContributors', () => {
        it('fetches contributors list', async () => {
            const result = await getContributors('facebook', 'react');

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('returns contributor details', async () => {
            const result = await getContributors('facebook', 'react');

            expect(result[0]).toHaveProperty('login');
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('contributions');
        });

        it('respects perPage parameter', async () => {
            const result = await getContributors('facebook', 'react', 2);

            expect(result.length).toBeLessThanOrEqual(2);
        });

        it('throws error for non-existent repo', async () => {
            await expect(
                getContributors('notfound', 'repo')
            ).rejects.toThrow();
        });
    });

    // ============================================
    // getLanguages TESTS
    // ============================================

    describe('getLanguages', () => {
        it('fetches languages breakdown', async () => {
            const result = await getLanguages('facebook', 'react');

            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('JavaScript');
        });

        it('returns byte counts for languages', async () => {
            const result = await getLanguages('facebook', 'react');

            expect(typeof result.JavaScript).toBe('number');
            expect(result.JavaScript).toBeGreaterThan(0);
        });

        it('throws error for non-existent repo', async () => {
            await expect(
                getLanguages('notfound', 'repo')
            ).rejects.toThrow();
        });
    });

    // ============================================
    // getCommits TESTS
    // ============================================

    describe('getCommits', () => {
        it('fetches commits list', async () => {
            const result = await getCommits('facebook', 'react');

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('returns commit details', async () => {
            const result = await getCommits('facebook', 'react');

            expect(result[0]).toHaveProperty('sha');
            expect(result[0]).toHaveProperty('commit');
            expect(result[0].commit).toHaveProperty('message');
            expect(result[0].commit).toHaveProperty('author');
        });

        it('respects perPage parameter', async () => {
            const result = await getCommits('facebook', 'react', 1);

            expect(result.length).toBeLessThanOrEqual(1);
        });

        it('throws error for non-existent repo', async () => {
            await expect(
                getCommits('notfound', 'repo')
            ).rejects.toThrow();
        });
    });
});
