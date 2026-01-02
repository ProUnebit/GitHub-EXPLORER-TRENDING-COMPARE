import { describe, it, expect } from 'vitest';
import {
    formatNumber,
    formatDate,
    formatRelativeTime,
} from '@/lib/utils/formatters';

describe('formatNumber', () => {
    it('returns number as string for values < 1000', () => {
        expect(formatNumber(500)).toBe('500');
        expect(formatNumber(999)).toBe('999');
    });

    it('formats thousands with K suffix', () => {
        expect(formatNumber(1000)).toBe('1K');
        expect(formatNumber(1500)).toBe('1.5K');
        expect(formatNumber(5400)).toBe('5.4K');
    });

    it('formats millions with M suffix', () => {
        expect(formatNumber(1000000)).toBe('1M');
        expect(formatNumber(2500000)).toBe('2.5M');
        expect(formatNumber(15600000)).toBe('15.6M');
    });

    it('handles zero', () => {
        expect(formatNumber(0)).toBe('0');
    });

    it('handles negative numbers', () => {
        expect(formatNumber(-1500)).toBe('-1.5K');
    });
});

describe('formatDate', () => {
    it('formats ISO date to readable format', () => {
        const date = '2024-12-30T10:00:00Z';
        const result = formatDate(date);

        // Проверяем что результат содержит месяц, день и год
        expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
    });

    it('handles different date formats', () => {
        expect(() => formatDate('2024-01-01')).not.toThrow();
        expect(() => formatDate('invalid')).not.toThrow();
    });
});

describe('formatRelativeTime', () => {
    it('returns "just now" for very recent dates', () => {
        const now = new Date();
        expect(formatRelativeTime(now.toISOString())).toBe('just now');
    });

    it('formats minutes ago', () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe(
            '5 minutes ago'
        );
    });

    it('formats hours ago', () => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe(
            '2 hours ago'
        );
    });

    it('formats days ago', () => {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe(
            '3 days ago'
        );
    });

    it('formats months ago', () => {
        const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        expect(formatRelativeTime(twoMonthsAgo.toISOString())).toContain(
            'months ago'
        );
    });
});
