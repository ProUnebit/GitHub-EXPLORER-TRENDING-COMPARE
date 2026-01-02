import { describe, it, expect } from 'vitest';
import { buildSearchQuery } from '@/lib/utils//query-builder';


describe('buildSearchQuery', () => {
    it('returns query as-is when no filters', () => {
        expect(buildSearchQuery({ query: 'react' })).toBe('react');
    });

    it('adds language filter', () => {
        expect(
            buildSearchQuery({
                query: 'react',
                language: 'javascript',
            })
        ).toBe('react language:javascript');
    });

    it('adds stars filter', () => {
        expect(
            buildSearchQuery({
                query: 'react',
                minStars: '1000',
            })
        ).toBe('react stars:>=1000');
    });

    it('adds both filters', () => {
        expect(
            buildSearchQuery({
                query: 'react',
                language: 'javascript',
                minStars: '1000',
            })
        ).toBe('react language:javascript stars:>=1000');
    });

    it('ignores stars filter when 0', () => {
        expect(
            buildSearchQuery({
                query: 'react',
                minStars: '0',
            })
        ).toBe('react');
    });
});
