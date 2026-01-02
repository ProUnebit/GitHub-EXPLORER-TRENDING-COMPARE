import { describe, it, expect } from 'vitest';
import { deduplicateById } from '@/lib/utils/array';

describe('deduplicateById', () => {
    it('removes duplicates', () => {
        const items = [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
            { id: 1, name: 'c' }, // Дубликат
        ];

        const result = deduplicateById(items);
        expect(result).toHaveLength(2);
        expect(result.map((r) => r.id)).toEqual([1, 2]);
    });

    it('preserves first occurrence', () => {
        const items = [
            { id: 1, name: 'first' },
            { id: 1, name: 'second' },
        ];

        const result = deduplicateById(items);
        expect(result[0].name).toBe('first');
    });
});
