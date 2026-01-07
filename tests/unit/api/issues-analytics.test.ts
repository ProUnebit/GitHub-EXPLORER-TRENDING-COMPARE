// tests/unit/api/issues-analytics.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { GitHubIssue } from '@/lib/github/types';

// We need to test the analytics calculation logic
// Since getIssuesAnalytics calls getIssues internally, we mock fetch at the global level

describe('Issues Analytics API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset modules before each test to get fresh imports
        vi.resetModules();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getIssuesAnalytics', () => {
        it('should calculate basic statistics correctly', async () => {
            const mockIssues: GitHubIssue[] = [
                {
                    id: 1,
                    number: 1,
                    title: 'Bug fix',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [{ id: 1, name: 'bug', color: 'd73a4a', description: 'Bug' }],
                    comments: 5,
                    reactions: { total_count: 3 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'Feature request',
                    state: 'closed',
                    created_at: '2024-11-01T00:00:00Z',
                    closed_at: '2024-11-15T00:00:00Z',
                    html_url: 'https://github.com/test/repo/issues/2',
                    user: { login: 'user2', avatar_url: 'https://avatar.url' },
                    labels: [{ id: 2, name: 'enhancement', color: 'a2eeef', description: 'Feature' }],
                    comments: 10,
                    reactions: { total_count: 7 },
                },
                {
                    id: 3,
                    number: 3,
                    title: 'Documentation',
                    state: 'closed',
                    created_at: '2024-10-01T00:00:00Z',
                    closed_at: '2024-10-05T00:00:00Z',
                    html_url: 'https://github.com/test/repo/issues/3',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [{ id: 3, name: 'docs', color: '0075ca', description: 'Documentation' }],
                    comments: 2,
                    reactions: { total_count: 1 },
                },
            ];

            // Mock global fetch
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            // Dynamic import after mocking
            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.total).toBe(3);
            expect(analytics.open).toBe(1);
            expect(analytics.closed).toBe(2);
        });

        it('should filter out pull requests', async () => {
            const mockData = [
                {
                    id: 1,
                    number: 1,
                    title: 'Issue',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'PR',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/pull/2',
                    pull_request: { url: 'https://api.github.com/repos/test/repo/pulls/2' },
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.total).toBe(1);
        });

        it('should calculate average close time correctly', async () => {
            const mockIssues = [
                {
                    id: 1,
                    number: 1,
                    title: 'Fast close',
                    state: 'closed',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: '2024-12-02T00:00:00Z', // 1 day
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'Slow close',
                    state: 'closed',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: '2024-12-06T00:00:00Z', // 5 days
                    html_url: 'https://github.com/test/repo/issues/2',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            // Average: (1 + 5) / 2 = 3 days
            expect(analytics.avgCloseTime).toBe(3);
        });

        it('should calculate top labels correctly (top 10)', async () => {
            const mockIssues = [
                {
                    id: 1,
                    number: 1,
                    title: 'Issue 1',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [
                        { id: 1, name: 'bug', color: 'd73a4a', description: '' },
                        { id: 2, name: 'critical', color: 'ff0000', description: '' },
                    ],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'Issue 2',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/2',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [{ id: 1, name: 'bug', color: 'd73a4a', description: '' }],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
                {
                    id: 3,
                    number: 3,
                    title: 'Issue 3',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/3',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [{ id: 1, name: 'bug', color: 'd73a4a', description: '' }],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.topLabels).toHaveLength(2);
            expect(analytics.topLabels[0].name).toBe('bug');
            expect(analytics.topLabels[0].count).toBe(3);
        });

        it('should limit top labels to 10', async () => {
            const mockIssues = Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                number: i + 1,
                title: `Issue ${i + 1}`,
                state: 'open' as const,
                created_at: '2024-12-01T00:00:00Z',
                closed_at: null,
                html_url: `https://github.com/test/repo/issues/${i + 1}`,
                user: { login: 'user1', avatar_url: 'https://avatar.url' },
                labels: [{ id: i + 1, name: `label-${i + 1}`, color: '000000', description: '' }],
                comments: 0,
                reactions: { total_count: 0 },
            }));

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.topLabels).toHaveLength(10);
        });

        it('should calculate hottest issues correctly', async () => {
            const mockIssues = [
                {
                    id: 1,
                    number: 1,
                    title: 'Hot issue',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 50,
                    reactions: { total_count: 30 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'Cold issue',
                    state: 'open',
                    created_at: '2024-12-01T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/2',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 5,
                    reactions: { total_count: 2 },
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.hottestIssues[0].number).toBe(1);
            expect(analytics.hottestIssues[1].number).toBe(2);
        });

        it('should generate timeline for last 6 months with activity logic', async () => {
            const now = new Date('2025-01-07T00:00:00Z');
            vi.setSystemTime(now);

            const mockIssues = [
                {
                    id: 1,
                    number: 1,
                    title: 'Dec created',
                    state: 'open',
                    created_at: '2024-12-15T00:00:00Z',
                    closed_at: null,
                    html_url: 'https://github.com/test/repo/issues/1',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
                {
                    id: 2,
                    number: 2,
                    title: 'Nov closed',
                    state: 'closed',
                    created_at: '2024-10-01T00:00:00Z',
                    closed_at: '2024-11-15T00:00:00Z',
                    html_url: 'https://github.com/test/repo/issues/2',
                    user: { login: 'user1', avatar_url: 'https://avatar.url' },
                    labels: [],
                    comments: 0,
                    reactions: { total_count: 0 },
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssues,
            });

            const { getIssuesAnalytics } = await import('@/lib/github/api');
            const analytics = await getIssuesAnalytics('test', 'repo');

            expect(analytics.timeline).toHaveLength(6);

            const decTimeline = analytics.timeline.find((t) => t.date === '2024-12');
            expect(decTimeline).toBeDefined();
            expect(decTimeline!.open).toBeGreaterThan(0);

            const novTimeline = analytics.timeline.find((t) => t.date === '2024-11');
            expect(novTimeline).toBeDefined();
            expect(novTimeline!.closed).toBeGreaterThan(0);
        });
    });
});
