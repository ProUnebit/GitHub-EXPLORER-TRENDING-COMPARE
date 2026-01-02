/**
 * Удаляет дубликаты по id
 * Generic функция - работает с любыми объектами с id
 */
export function deduplicateById<T extends { id: number | string }>(
    items: T[]
): T[] {
    const seen = new Set<number | string>();
    return items.filter((item) => {
        if (seen.has(item.id)) {
            return false;
        }
        seen.add(item.id);
        return true;
    });
}
