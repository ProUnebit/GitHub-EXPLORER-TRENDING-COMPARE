import { describe, it, expect } from 'vitest';
import {
    formatNumber,
    formatRelativeTime,
    formatDate,
    parseRepoFullName,
    calculateLanguagePercentages,
} from '@/lib/utils/formatters';

// formatNumber TESTS

describe('formatNumber', () => {
    describe('small numbers (< 1000)', () => {
        it('returns number as string for values < 1000', () => {
            expect(formatNumber(0)).toBe('0');
            expect(formatNumber(1)).toBe('1');
            expect(formatNumber(500)).toBe('500');
            expect(formatNumber(999)).toBe('999');
        });
    });

    describe('thousands (1K - 999K)', () => {
        it('formats 1000 as 1.0k', () => {
            expect(formatNumber(1000)).toBe('1.0k');
        });

        it('formats thousands with decimal', () => {
            expect(formatNumber(1500)).toBe('1.5k');
            expect(formatNumber(5400)).toBe('5.4k');
            expect(formatNumber(10000)).toBe('10.0k');
            expect(formatNumber(999999)).toBe('1000.0k');
        });
    });

    describe('millions (1M+)', () => {
        it('formats 1000000 as 1.0M', () => {
            expect(formatNumber(1000000)).toBe('1.0M');
        });

        it('formats millions with decimal', () => {
            expect(formatNumber(2500000)).toBe('2.5M');
            expect(formatNumber(15600000)).toBe('15.6M');
            expect(formatNumber(100000000)).toBe('100.0M');
        });
    });

    describe('edge cases', () => {
        it('handles negative numbers', () => {
            // The function doesn't explicitly handle negatives
            // but should work mathematically
            expect(formatNumber(-500)).toBe('-500');
        });
    });
});

// formatRelativeTime TESTS

describe('formatRelativeTime', () => {
    it('returns "just now" for current time', () => {
        const now = new Date();
        expect(formatRelativeTime(now.toISOString())).toBe('just now');
    });

    it('returns "just now" for very recent time (<1 minute)', () => {
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        expect(formatRelativeTime(thirtySecondsAgo.toISOString())).toBe('just now');
    });

    describe('minutes', () => {
        it('formats 1 minute ago', () => {
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
            expect(formatRelativeTime(oneMinuteAgo.toISOString())).toBe('1 minute ago');
        });

        it('formats multiple minutes ago', () => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe('5 minutes ago');
        });
    });

    describe('hours', () => {
        it('formats 1 hour ago', () => {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            expect(formatRelativeTime(oneHourAgo.toISOString())).toBe('1 hour ago');
        });

        it('formats multiple hours ago', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe('2 hours ago');
        });
    });

    describe('days', () => {
        it('formats 1 day ago', () => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(oneDayAgo.toISOString())).toBe('1 day ago');
        });

        it('formats multiple days ago', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe('3 days ago');
        });
    });

    describe('weeks', () => {
        it('formats 1 week ago', () => {
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(oneWeekAgo.toISOString())).toBe('1 week ago');
        });

        it('formats multiple weeks ago', () => {
            const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(twoWeeksAgo.toISOString())).toBe('2 weeks ago');
        });
    });

    describe('months', () => {
        it('formats 1 month ago', () => {
            const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(oneMonthAgo.toISOString())).toBe('1 month ago');
        });

        it('formats multiple months ago', () => {
            const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(twoMonthsAgo.toISOString())).toBe('2 months ago');
        });
    });

    describe('years', () => {
        it('formats 1 year ago', () => {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(oneYearAgo.toISOString())).toBe('1 year ago');
        });

        it('formats multiple years ago', () => {
            const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
            expect(formatRelativeTime(twoYearsAgo.toISOString())).toBe('2 years ago');
        });
    });

    it('accepts Date object', () => {
        const now = new Date();
        expect(formatRelativeTime(now)).toBe('just now');
    });
});

// formatDate TESTS

describe('formatDate', () => {
    it('formats ISO date string to readable format', () => {
        const date = '2024-12-30T10:00:00Z';
        const result = formatDate(date);
        // Format: "Dec 30, 2024"
        expect(result).toMatch(/Dec 30, 2024/);
    });

    it('formats Date object', () => {
        const date = new Date('2024-01-15T10:00:00Z');
        const result = formatDate(date);
        expect(result).toMatch(/Jan 15, 2024/);
    });

    it('handles different months', () => {
        expect(formatDate('2024-06-01')).toMatch(/Jun/);
        expect(formatDate('2024-03-15')).toMatch(/Mar/);
        expect(formatDate('2024-11-20')).toMatch(/Nov/);
    });
});

// parseRepoFullName TESTS

describe('parseRepoFullName', () => {
    it('parses owner/repo format correctly', () => {
        const result = parseRepoFullName('facebook/react');
        expect(result).toEqual({ owner: 'facebook', repo: 'react' });
    });

    it('parses different cases', () => {
        expect(parseRepoFullName('vuejs/vue')).toEqual({ owner: 'vuejs', repo: 'vue' });
        expect(parseRepoFullName('microsoft/vscode')).toEqual({ owner: 'microsoft', repo: 'vscode' });
    });

    it('handles repos with hyphens', () => {
        expect(parseRepoFullName('vercel/next.js')).toEqual({ owner: 'vercel', repo: 'next.js' });
    });
});

// calculateLanguagePercentages TESTS

describe('calculateLanguagePercentages', () => {
    it('calculates percentages correctly', () => {
        const languages = {
            JavaScript: 5000,
            TypeScript: 3000,
            CSS: 2000,
        };

        const result = calculateLanguagePercentages(languages);

        expect(result).toHaveLength(3);
        expect(result[0].name).toBe('JavaScript');
        expect(result[0].percentage).toBe(50);
        expect(result[1].name).toBe('TypeScript');
        expect(result[1].percentage).toBe(30);
        expect(result[2].name).toBe('CSS');
        expect(result[2].percentage).toBe(20);
    });

    it('sorts by bytes descending', () => {
        const languages = {
            CSS: 100,
            TypeScript: 300,
            JavaScript: 200,
        };

        const result = calculateLanguagePercentages(languages);

        expect(result[0].name).toBe('TypeScript');
        expect(result[1].name).toBe('JavaScript');
        expect(result[2].name).toBe('CSS');
    });

    it('includes bytes in result', () => {
        const languages = { JavaScript: 1000 };
        const result = calculateLanguagePercentages(languages);

        expect(result[0].bytes).toBe(1000);
    });

    it('handles single language (100%)', () => {
        const languages = { JavaScript: 5000 };
        const result = calculateLanguagePercentages(languages);

        expect(result).toHaveLength(1);
        expect(result[0].percentage).toBe(100);
    });

    it('handles empty object', () => {
        const result = calculateLanguagePercentages({});
        expect(result).toHaveLength(0);
    });
});
