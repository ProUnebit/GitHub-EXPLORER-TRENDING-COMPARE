/**
 * ============================================
 * HEALTH SCORE CONFIGURATION
 * ============================================
 * 
 * Конфигурация алгоритма Health Score
 * 
 * ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ:
 * - Легко настраивать веса категорий
 * - Понятны все пороговые значения
 * - Можно A/B тестировать разные алгоритмы
 * - Все в одном месте для документации
 */

// ============================================
// CATEGORY WEIGHTS (должны суммироваться в 100)
// ============================================
export const WEIGHTS = {
    /** Вес категории "Activity" (как недавно обновлялся) */
    ACTIVITY: 30,
    
    /** Вес категории "Community" (stars, forks, watchers) */
    COMMUNITY: 30,
    
    /** Вес категории "Documentation" (README, wiki, license) */
    DOCUMENTATION: 20,
    
    /** Вес категории "Maintenance" (issue management) */
    MAINTENANCE: 20,
} as const;

// ============================================
// ACTIVITY THRESHOLDS (days)
// ============================================
export const ACTIVITY = {
    /** Отлично: обновлялся на прошлой неделе */
    EXCELLENT_DAYS: 7,
    
    /** Хорошо: обновлялся в течение месяца */
    GOOD_DAYS: 30,
    
    /** Средне: обновлялся в течение 3 месяцев */
    FAIR_DAYS: 90,
    
    /** Плохо: не обновлялся больше 3 месяцев */
    // (неявно - все что больше FAIR_DAYS)
} as const;

// ============================================
// COMMUNITY METRICS
// ============================================
export const COMMUNITY = {
    /** Делитель для stars (1 star = X баллов) */
    STARS_DIVISOR: 1000,
    
    /** Максимум баллов за stars */
    STARS_MAX_POINTS: 15,
    
    /** Делитель для forks (1 fork = X баллов) */
    FORKS_DIVISOR: 100,
    
    /** Максимум баллов за forks */
    FORKS_MAX_POINTS: 15,
} as const;

// ============================================
// DOCUMENTATION POINTS
// ============================================
export const DOCUMENTATION = {
    /** Баллы за наличие description */
    DESCRIPTION_POINTS: 10,
    
    /** Баллы за наличие wiki */
    WIKI_POINTS: 5,
    
    /** Баллы за наличие license */
    LICENSE_POINTS: 5,
} as const;

// ============================================
// MAINTENANCE THRESHOLDS (issue ratio)
// ============================================
export const MAINTENANCE = {
    /** Отлично: меньше 5% открытых issues от stars */
    EXCELLENT_RATIO: 0.05,
    EXCELLENT_POINTS: 20,
    
    /** Хорошо: меньше 10% открытых issues */
    GOOD_RATIO: 0.1,
    GOOD_POINTS: 15,
    
    /** Средне: меньше 20% открытых issues */
    FAIR_RATIO: 0.2,
    FAIR_POINTS: 10,
    
    /** Плохо: больше 20% открытых issues */
    POOR_POINTS: 5,
} as const;

// ============================================
// SCORE GRADES
// ============================================
export const GRADES = {
    /** Отличный репозиторий */
    EXCELLENT: {
        MIN_SCORE: 90,
        LABEL: 'Excellent',
        EMOJI: '💚',
        COLOR: 'green',
    },
    
    /** Хороший репозиторий */
    GOOD: {
        MIN_SCORE: 70,
        LABEL: 'Good',
        EMOJI: '💛',
        COLOR: 'yellow',
    },
    
    /** Средний репозиторий */
    FAIR: {
        MIN_SCORE: 50,
        LABEL: 'Fair',
        EMOJI: '🧡',
        COLOR: 'orange',
    },
    
    /** Плохой репозиторий */
    POOR: {
        MIN_SCORE: 0,
        LABEL: 'Poor',
        EMOJI: '❤️',
        COLOR: 'red',
    },
} as const;

// ============================================
// HELPER: Validate configuration
// ============================================
const totalWeight = WEIGHTS.ACTIVITY + WEIGHTS.COMMUNITY + WEIGHTS.DOCUMENTATION + WEIGHTS.MAINTENANCE;
if (totalWeight !== 100) {
    console.warn(`⚠️ Health Score weights sum to ${totalWeight}, not 100!`);
}

// ============================================
// EXPORTS
// ============================================
export type GradeConfig = typeof GRADES;
export type WeightsConfig = typeof WEIGHTS;
