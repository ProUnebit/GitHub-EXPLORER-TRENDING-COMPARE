
// CHARTS & VISUALIZATIONS

export const CHARTS = {
    /** Количество месяцев для Issues Timeline */
    TIMELINE_MONTHS: 6,
    
    /** Количество top labels для отображения */
    TOP_LABELS_COUNT: 10,
    
    /** Количество hottest issues для отображения */
    TOP_ISSUES_COUNT: 5,
    
    /** Количество top contributors в charts */
    TOP_CONTRIBUTORS_COUNT: 5,
} as const;


// TABLES & LISTS

export const TABLES = {
    /** Количество строк в таблице по умолчанию */
    DEFAULT_PAGE_SIZE: 10,
    
    /** Опции для per-page селектора */
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;


// THRESHOLDS

export const THRESHOLDS = {
    /** Порог для предупреждения (open issues %) */
    ISSUES_WARNING_PERCENT: 25,
    
    /** Порог для критического состояния */
    ISSUES_CRITICAL_PERCENT: 50,
} as const;


// TRUNCATION

export const TRUNCATE = {
    /** Максимальная длина commit message в таблице */
    COMMIT_MESSAGE_LENGTH: 60,
    
    /** Максимальная длина описания репозитория */
    REPO_DESCRIPTION_LENGTH: 150,
    
    /** Максимальная длина заголовка issue */
    ISSUE_TITLE_LENGTH: 80,
} as const;


// EXPORT TYPES

export type ChartsConfig = typeof CHARTS;
export type TablesConfig = typeof TABLES;
export type ThresholdsConfig = typeof THRESHOLDS;
