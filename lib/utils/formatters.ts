/**
 * Форматирование чисел (1000 -> 1k, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}k`;
    }
    return num.toString();
}

/**
 * Форматирование даты в относительный формат (2 days ago, 3 months ago)
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }

    return 'just now';
}

/**
 * Форматирование даты в читаемый формат (Jan 15, 2024)
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Извлечение owner и repo из full_name
 */
export function parseRepoFullName(fullName: string): {
    owner: string;
    repo: string;
} {
    const [owner, repo] = fullName.split('/');
    return { owner, repo };
}

/**
 * Вычисление процентов для языков
 */
export function calculateLanguagePercentages(languages: {
    [key: string]: number;
}): Array<{ name: string; bytes: number; percentage: number }> {
    const total = Object.values(languages).reduce(
        (sum, bytes) => sum + bytes,
        0
    );

    return Object.entries(languages)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: (bytes / total) * 100,
        }))
        .sort((a, b) => b.bytes - a.bytes);
}
