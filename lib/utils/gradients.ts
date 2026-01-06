/**
 * ============================================
 * GRADIENT UTILITIES
 * ============================================
 *
 * Утилиты для генерации рандомных градиентов
 *
 * Используется для:
 * - FeedbackCard backgrounds
 * - QuickStats cards
 * - Любые компоненты с градиентами
 */

// ============================================
// GRADIENT PRESETS
// ============================================
export const GRADIENT_PRESETS = [
    // Warm gradients
    'from-orange-500/10 via-red-500/10 to-pink-500/10',
    'from-yellow-500/10 via-amber-500/10 to-orange-500/10',
    'from-pink-500/10 via-rose-500/10 to-red-500/10',
    'from-amber-500/10 via-orange-500/10 to-red-500/10',

    // Cool gradients
    'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
    'from-cyan-500/10 via-teal-500/10 to-emerald-500/10',
    'from-indigo-500/10 via-blue-500/10 to-cyan-500/10',
    'from-sky-500/10 via-blue-500/10 to-indigo-500/10',

    // Nature gradients
    'from-teal-500/10 via-green-500/10 to-emerald-500/10',
    'from-emerald-500/10 via-green-500/10 to-lime-500/10',
    'from-lime-500/10 via-green-500/10 to-teal-500/10',

    // Purple/Pink gradients
    'from-purple-500/10 via-pink-500/10 to-rose-500/10',
    'from-violet-500/10 via-purple-500/10 to-fuchsia-500/10',
    'from-fuchsia-500/10 via-pink-500/10 to-rose-500/10',

    // Sunset gradients
    'from-orange-500/10 via-pink-500/10 to-purple-500/10',
    'from-yellow-500/10 via-orange-500/10 to-pink-500/10',

    // Ocean gradients
    'from-blue-500/10 via-teal-500/10 to-cyan-500/10',
    'from-cyan-500/10 via-blue-500/10 to-purple-500/10',
];

// ============================================
// GET GRADIENT BY ID
// ============================================
/**
 * Получить стабильный градиент на основе ID
 *
 * Важно: Один и тот же ID всегда возвращает один градиент
 * Это гарантирует что gradient не меняется при ререндерах
 *
 * @param id - уникальный идентификатор (например, feedback.id)
 * @returns градиент из GRADIENT_PRESETS
 */
export function getGradientById(id: number): string {
    const index = id % GRADIENT_PRESETS.length;
    return GRADIENT_PRESETS[index];
}

// ============================================
// GET RANDOM GRADIENT
// ============================================
/**
 * Получить случайный градиент
 *
 * Внимание: Возвращает разные градиенты при каждом вызове
 * Используй только если не нужна стабильность
 *
 * @returns случайный градиент из GRADIENT_PRESETS
 */
export function getRandomGradient(): string {
    const index = Math.floor(Math.random() * GRADIENT_PRESETS.length);
    return GRADIENT_PRESETS[index];
}
