import { describe, it, expect } from 'vitest';
import { deduplicateById } from '@/lib/utils/array';

// deduplicateById TESTS

describe('deduplicateById', () => {
    describe('basic functionality', () => {
        it('removes duplicate items by id', () => {
            const items = [
                { id: 1, name: 'first' },
                { id: 2, name: 'second' },
                { id: 1, name: 'duplicate' },
            ];

            const result = deduplicateById(items);

            expect(result).toHaveLength(2);
            expect(result.map((r) => r.id)).toEqual([1, 2]);
        });

        it('preserves first occurrence of duplicate', () => {
            const items = [
                { id: 1, name: 'first' },
                { id: 1, name: 'second' },
            ];

            const result = deduplicateById(items);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('first');
        });

        it('preserves order of unique items', () => {
            const items = [
                { id: 3, name: 'third' },
                { id: 1, name: 'first' },
                { id: 2, name: 'second' },
            ];

            const result = deduplicateById(items);

            expect(result).toHaveLength(3);
            expect(result[0].id).toBe(3);
            expect(result[1].id).toBe(1);
            expect(result[2].id).toBe(2);
        });
    });

    describe('edge cases', () => {
        it('returns empty array for empty input', () => {
            const result = deduplicateById([]);
            expect(result).toEqual([]);
        });

        it('returns same array when no duplicates', () => {
            const items = [
                { id: 1, name: 'one' },
                { id: 2, name: 'two' },
                { id: 3, name: 'three' },
            ];

            const result = deduplicateById(items);

            expect(result).toHaveLength(3);
            expect(result).toEqual(items);
        });

        it('handles single item array', () => {
            const items = [{ id: 1, name: 'only' }];
            const result = deduplicateById(items);
            expect(result).toEqual(items);
        });

        it('handles all duplicates', () => {
            const items = [
                { id: 1, name: 'first' },
                { id: 1, name: 'second' },
                { id: 1, name: 'third' },
            ];

            const result = deduplicateById(items);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('first');
        });
    });

    describe('id types', () => {
        it('handles numeric ids', () => {
            const items = [
                { id: 1, name: 'one' },
                { id: 2, name: 'two' },
                { id: 1, name: 'dup' },
            ];

            expect(deduplicateById(items)).toHaveLength(2);
        });

        it('handles string ids', () => {
            const items = [
                { id: 'a', name: 'one' },
                { id: 'b', name: 'two' },
                { id: 'a', name: 'dup' },
            ];

            expect(deduplicateById(items)).toHaveLength(2);
        });

        it('handles mixed id types distinctly', () => {
            const items = [
                { id: 1, name: 'numeric one' },
                { id: '1', name: 'string one' },
            ];

            const result = deduplicateById(items);
            // Set treats 1 and '1' as different
            expect(result).toHaveLength(2);
        });
    });

    describe('complex objects', () => {
        it('works with repository-like objects', () => {
            const repos = [
                { id: 100, name: 'react', owner: 'facebook' },
                { id: 200, name: 'vue', owner: 'vuejs' },
                { id: 100, name: 'react-dup', owner: 'other' },
            ];

            const result = deduplicateById(repos);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('react');
            expect(result[1].name).toBe('vue');
        });
    });
});
