import { describe, it, expect } from 'vitest';
import { calculateHealthScore, getHealthBadge } from '@/lib/utils/health-score';
import type { GitHubRepo } from '@/lib/github/types';

// HELPER: Create repo with specific attributes

function createMockRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
    return {
        id: 1,
        name: 'test-repo',
        full_name: 'test/test-repo',
        owner: {
            login: 'test',
            id: 1,
            avatar_url: 'https://example.com/avatar.png',
            html_url: 'https://github.com/test',
            type: 'User',
        },
        html_url: 'https://github.com/test/test-repo',
        description: 'A test repository',
        fork: false,
        created_at: '2020-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
        stargazers_count: 1000,
        watchers_count: 1000,
        forks_count: 100,
        open_issues_count: 10,
        language: 'JavaScript',
        topics: [],
        visibility: 'public',
        default_branch: 'main',
        license: {
            key: 'mit',
            name: 'MIT License',
            spdx_id: 'MIT',
            url: 'https://api.github.com/licenses/mit',
        },
        has_wiki: true,
        ...overrides,
    };
}

// calculateHealthScore TESTS

describe('calculateHealthScore', () => {
    describe('activity score (30 points max)', () => {
        it('gives 30 points for recently updated (<7 days)', () => {
            const repo = createMockRepo({
                updated_at: new Date().toISOString(), // Now
            });

            const score = calculateHealthScore(repo);
            expect(score.activity).toBe(30);
        });

        it('gives 20 points for moderately recent (7-30 days)', () => {
            const repo = createMockRepo({
                updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            });

            const score = calculateHealthScore(repo);
            expect(score.activity).toBe(20);
        });

        it('gives 10 points for somewhat recent (30-90 days)', () => {
            const repo = createMockRepo({
                updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            });

            const score = calculateHealthScore(repo);
            expect(score.activity).toBe(10);
        });

        it('gives 0 points for abandoned (>90 days)', () => {
            const repo = createMockRepo({
                updated_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
            });

            const score = calculateHealthScore(repo);
            expect(score.activity).toBe(0);
        });
    });

    describe('community score (30 points max)', () => {
        it('calculates stars weight (up to 15 points)', () => {
            // 15000 stars = 15 points
            const highStarsRepo = createMockRepo({ stargazers_count: 15000, forks_count: 0 });
            const highScore = calculateHealthScore(highStarsRepo);
            expect(highScore.community).toBeGreaterThanOrEqual(15);

            // 5000 stars = 5 points
            const midStarsRepo = createMockRepo({ stargazers_count: 5000, forks_count: 0 });
            const midScore = calculateHealthScore(midStarsRepo);
            expect(midScore.community).toBe(5);
        });

        it('calculates forks weight (up to 15 points)', () => {
            // 1500 forks = 15 points
            const highForksRepo = createMockRepo({ stargazers_count: 0, forks_count: 1500 });
            const highScore = calculateHealthScore(highForksRepo);
            expect(highScore.community).toBeGreaterThanOrEqual(15);

            // 500 forks = 5 points
            const midForksRepo = createMockRepo({ stargazers_count: 0, forks_count: 500 });
            const midScore = calculateHealthScore(midForksRepo);
            expect(midScore.community).toBe(5);
        });

        it('caps at 30 points combined', () => {
            const massiveRepo = createMockRepo({
                stargazers_count: 100000,
                forks_count: 50000,
            });

            const score = calculateHealthScore(massiveRepo);
            expect(score.community).toBeLessThanOrEqual(30);
        });
    });

    describe('documentation score (20 points max)', () => {
        it('gives 10 points for description', () => {
            const repoWithDesc = createMockRepo({
                description: 'A great repo',
                has_wiki: false,
                license: null,
            });

            const score = calculateHealthScore(repoWithDesc);
            expect(score.documentation).toBe(10);
        });

        it('gives 5 points for wiki', () => {
            const repoWithWiki = createMockRepo({
                description: null,
                has_wiki: true,
                license: null,
            });

            const score = calculateHealthScore(repoWithWiki);
            expect(score.documentation).toBe(5);
        });

        it('gives 5 points for license', () => {
            const repoWithLicense = createMockRepo({
                description: null,
                has_wiki: false,
                license: { key: 'mit', name: 'MIT', spdx_id: 'MIT', url: null },
            });

            const score = calculateHealthScore(repoWithLicense);
            expect(score.documentation).toBe(5);
        });

        it('gives 20 points for all documentation', () => {
            const fullyDocumented = createMockRepo({
                description: 'Great description',
                has_wiki: true,
                license: { key: 'mit', name: 'MIT', spdx_id: 'MIT', url: null },
            });

            const score = calculateHealthScore(fullyDocumented);
            expect(score.documentation).toBe(20);
        });

        it('gives 0 points for no documentation', () => {
            const undocumented = createMockRepo({
                description: null,
                has_wiki: false,
                license: null,
            });

            const score = calculateHealthScore(undocumented);
            expect(score.documentation).toBe(0);
        });
    });

    describe('maintenance score (20 points max)', () => {
        it('gives 20 points for excellent ratio (<5% issues)', () => {
            const repo = createMockRepo({
                stargazers_count: 1000,
                open_issues_count: 40, // 4%
            });

            const score = calculateHealthScore(repo);
            expect(score.maintenance).toBe(20);
        });

        it('gives 15 points for good ratio (5-10% issues)', () => {
            const repo = createMockRepo({
                stargazers_count: 1000,
                open_issues_count: 70, // 7%
            });

            const score = calculateHealthScore(repo);
            expect(score.maintenance).toBe(15);
        });

        it('gives 10 points for average ratio (10-20% issues)', () => {
            const repo = createMockRepo({
                stargazers_count: 1000,
                open_issues_count: 150, // 15%
            });

            const score = calculateHealthScore(repo);
            expect(score.maintenance).toBe(10);
        });

        it('gives 5 points for poor ratio (>20% issues)', () => {
            const repo = createMockRepo({
                stargazers_count: 1000,
                open_issues_count: 300, // 30%
            });

            const score = calculateHealthScore(repo);
            expect(score.maintenance).toBe(5);
        });

        it('handles zero stars without division error', () => {
            const repo = createMockRepo({
                stargazers_count: 0,
                open_issues_count: 100,
            });

            // Should not throw
            const score = calculateHealthScore(repo);
            expect(score.maintenance).toBeDefined();
        });
    });

    describe('total score', () => {
        it('sums all categories', () => {
            const repo = createMockRepo();
            const score = calculateHealthScore(repo);

            expect(score.total).toBe(
                score.activity + score.community + score.documentation + score.maintenance
            );
        });

        it('caps at 100', () => {
            const perfectRepo = createMockRepo({
                updated_at: new Date().toISOString(),
                stargazers_count: 100000,
                forks_count: 50000,
                description: 'Great',
                has_wiki: true,
                license: { key: 'mit', name: 'MIT', spdx_id: 'MIT', url: null },
                open_issues_count: 10,
            });

            const score = calculateHealthScore(perfectRepo);
            expect(score.total).toBeLessThanOrEqual(100);
        });

        it('returns breakdown object', () => {
            const repo = createMockRepo();
            const score = calculateHealthScore(repo);

            expect(score).toHaveProperty('activity');
            expect(score).toHaveProperty('community');
            expect(score).toHaveProperty('documentation');
            expect(score).toHaveProperty('maintenance');
            expect(score).toHaveProperty('total');
        });
    });
});

// getHealthBadge TESTS

describe('getHealthBadge', () => {
    describe('excellent (90+)', () => {
        it('returns green badge for score >= 90', () => {
            const badge = getHealthBadge(90);

            expect(badge.emoji).toBe('💚');
            expect(badge.label).toBe('Excellent');
            expect(badge.color).toBe('green');
        });

        it('returns green badge for perfect score', () => {
            const badge = getHealthBadge(100);

            expect(badge.emoji).toBe('💚');
            expect(badge.label).toBe('Excellent');
        });
    });

    describe('good (70-89)', () => {
        it('returns yellow badge for score 70-89', () => {
            const badge = getHealthBadge(70);

            expect(badge.emoji).toBe('💛');
            expect(badge.label).toBe('Good');
            expect(badge.color).toBe('yellow');
        });

        it('returns yellow badge for score 89', () => {
            const badge = getHealthBadge(89);
            expect(badge.label).toBe('Good');
        });
    });

    describe('fair (50-69)', () => {
        it('returns orange badge for score 50-69', () => {
            const badge = getHealthBadge(50);

            expect(badge.emoji).toBe('🧡');
            expect(badge.label).toBe('Fair');
            expect(badge.color).toBe('orange');
        });

        it('returns orange badge for score 69', () => {
            const badge = getHealthBadge(69);
            expect(badge.label).toBe('Fair');
        });
    });

    describe('poor (<50)', () => {
        it('returns red badge for score < 50', () => {
            const badge = getHealthBadge(49);

            expect(badge.emoji).toBe('❤️');
            expect(badge.label).toBe('Poor');
            expect(badge.color).toBe('red');
        });

        it('returns red badge for very low score', () => {
            const badge = getHealthBadge(10);
            expect(badge.label).toBe('Poor');
        });

        it('returns red badge for zero', () => {
            const badge = getHealthBadge(0);
            expect(badge.label).toBe('Poor');
        });
    });

    describe('badge properties', () => {
        it('includes all required properties', () => {
            const badge = getHealthBadge(75);

            expect(badge).toHaveProperty('emoji');
            expect(badge).toHaveProperty('label');
            expect(badge).toHaveProperty('color');
            expect(badge).toHaveProperty('textColor');
            expect(badge).toHaveProperty('bgColor');
        });

        it('has valid CSS class names', () => {
            const badge = getHealthBadge(90);

            expect(badge.textColor).toMatch(/text-/);
            expect(badge.bgColor).toMatch(/bg-/);
        });
    });
});
