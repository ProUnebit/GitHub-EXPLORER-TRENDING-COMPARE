/**
 * ============================================
 * CONFIGURATION INDEX
 * ============================================
 * 
 * Централизованный экспорт всех конфигураций
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * import { PAGINATION, WEIGHTS, CHARTS } from '@/config';
 */

// API Configuration
export {
    PAGINATION,
    CACHE,
    RETRY,
    RATE_LIMIT,
    SEARCH_FILTERS,
    type PaginationConfig,
    type CacheConfig,
    type RetryConfig,
} from './api';

// Health Score Configuration
export {
    WEIGHTS,
    ACTIVITY,
    COMMUNITY,
    DOCUMENTATION,
    MAINTENANCE,
    GRADES,
    type GradeConfig,
    type WeightsConfig,
} from './health-score';

// UI Configuration
export {
    CHARTS,
    TABLES,
    THRESHOLDS,
    TRUNCATE,
    type ChartsConfig,
    type TablesConfig,
    type ThresholdsConfig,
} from './ui';
