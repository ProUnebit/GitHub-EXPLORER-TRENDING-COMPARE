import { describe, it, expect } from 'vitest';
import { buildSearchQuery } from '@/lib/utils/query-builder';

// buildSearchQuery TESTS

describe('buildSearchQuery', () => {
    describe('basic query', () => {
        it('returns query as-is when no filters', () => {
            expect(buildSearchQuery({ query: 'react' })).toBe('react');
        });

        it('preserves complex queries', () => {
            expect(buildSearchQuery({ query: 'react hooks' })).toBe('react hooks');
        });

        it('handles single word query', () => {
            expect(buildSearchQuery({ query: 'typescript' })).toBe('typescript');
        });
    });

    describe('language filter', () => {
        it('adds language filter', () => {
            const result = buildSearchQuery({
                query: 'react',
                language: 'javascript',
            });
            expect(result).toBe('react language:javascript');
        });

        it('handles different languages', () => {
            expect(buildSearchQuery({ query: 'app', language: 'python' })).toBe('app language:python');
            expect(buildSearchQuery({ query: 'cli', language: 'rust' })).toBe('cli language:rust');
            expect(buildSearchQuery({ query: 'web', language: 'go' })).toBe('web language:go');
        });

        it('ignores empty language', () => {
            expect(buildSearchQuery({ query: 'react', language: '' })).toBe('react');
        });
    });

    describe('minStars filter', () => {
        it('adds stars filter', () => {
            const result = buildSearchQuery({
                query: 'react',
                minStars: '1000',
            });
            expect(result).toBe('react stars:>=1000');
        });

        it('handles different star counts', () => {
            expect(buildSearchQuery({ query: 'app', minStars: '100' })).toBe('app stars:>=100');
            expect(buildSearchQuery({ query: 'app', minStars: '5000' })).toBe('app stars:>=5000');
            expect(buildSearchQuery({ query: 'app', minStars: '50000' })).toBe('app stars:>=50000');
        });

        it('ignores minStars of 0', () => {
            expect(buildSearchQuery({ query: 'react', minStars: '0' })).toBe('react');
        });

        it('ignores empty minStars', () => {
            expect(buildSearchQuery({ query: 'react', minStars: '' })).toBe('react');
        });

        it('ignores negative minStars', () => {
            expect(buildSearchQuery({ query: 'react', minStars: '-100' })).toBe('react');
        });
    });

    describe('combined filters', () => {
        it('adds both language and stars filters', () => {
            const result = buildSearchQuery({
                query: 'react',
                language: 'javascript',
                minStars: '1000',
            });
            expect(result).toBe('react language:javascript stars:>=1000');
        });

        it('maintains filter order', () => {
            const result = buildSearchQuery({
                query: 'test',
                language: 'python',
                minStars: '500',
            });
            // Language comes before stars
            expect(result).toMatch(/language:python.*stars:>=500/);
        });
    });

    describe('edge cases', () => {
        it('handles query with special characters', () => {
            expect(buildSearchQuery({ query: 'react-native' })).toBe('react-native');
            expect(buildSearchQuery({ query: 'next.js' })).toBe('next.js');
        });

        it('handles whitespace in query', () => {
            const result = buildSearchQuery({ query: '  react  ', language: 'javascript' });
            expect(result).toBe('  react   language:javascript');
        });
    });
});
