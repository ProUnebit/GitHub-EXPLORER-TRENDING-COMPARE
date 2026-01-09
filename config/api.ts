
// PAGINATION LIMITS

export const PAGINATION = {
    /** Количество репозиториев на странице поиска */
    SEARCH_PER_PAGE: 30,
    
    /** Количество trending репозиториев */
    TRENDING_PER_PAGE: 30,
    
    /** Максимальное количество contributors */
    CONTRIBUTORS_LIMIT: 100,
    
    /** Максимальное количество issues для аналитики */
    ISSUES_LIMIT: 100,
    
    /** Количество issues по умолчанию для запроса */
    ISSUES_DEFAULT: 100,
    
    /** Количество последних коммитов */
    COMMITS_LIMIT: 10,
    
    /** Количество contributors на странице репозитория (для UI) */
    CONTRIBUTORS_DISPLAY: 10,
} as const;


// CACHE REVALIDATION (seconds)

export const CACHE = {
    /** Статические данные (repository details, contributors) - 1 час */
    STATIC: 3600,
    
    /** Динамические данные (search results, trending) - 5 минут */
    DYNAMIC: 300,
    
    /** Очень динамические данные (issues, commits) - 1 минута */
    REALTIME: 60,
} as const;


// API RETRY CONFIGURATION

export const RETRY = {
    /** Максимальное количество повторных попыток */
    MAX_ATTEMPTS: 3,
    
    /** Базовая задержка между попытками (ms) */
    BASE_DELAY: 1000,
    
    /** HTTP коды для которых НЕ делаем retry */
    NO_RETRY_CODES: [400, 401, 403, 404, 422] as const,
    
    /** HTTP коды для которых делаем retry */
    RETRY_CODES: [408, 429, 500, 502, 503, 504] as const,
} as const;


// RATE LIMITING

export const RATE_LIMIT = {
    /** Предупреждение когда осталось меньше запросов */
    WARNING_THRESHOLD: 100,
    
    /** Критический уровень */
    CRITICAL_THRESHOLD: 10,
} as const;


// SEARCH FILTERS

export const SEARCH_FILTERS = {
    /** Минимальное количество звезд по умолчанию */
    MIN_STARS_DEFAULT: 0,
    
    /** Популярные значения звезд для фильтров */
    STARS_OPTIONS: [0, 100, 1000, 5000, 10000] as const,
} as const;


// EXPORT TYPES

export type PaginationConfig = typeof PAGINATION;
export type CacheConfig = typeof CACHE;
export type RetryConfig = typeof RETRY;
