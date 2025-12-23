export const GITHUB_API_BASE_URL = 'https://api.github.com';

export const CACHE_REVALIDATION = {
    STATIC: 3600, // 1 hour
    DYNAMIC: 300, // 5 minutes
    TRENDING: 1800, // 30 minutes
} as const;

export const ITEMS_PER_PAGE = 30;
