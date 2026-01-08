import type { GitHubRepo } from '@/lib/github/types';
import {
    WEIGHTS,
    ACTIVITY,
    COMMUNITY,
    DOCUMENTATION,
    MAINTENANCE,
    GRADES,
} from '@/config';

// ============================================
// HEALTH SCORE CALCULATOR
// ============================================
// Вычисляет "здоровье" репозитория (0-100)
//
// ТЕПЕРЬ ИСПОЛЬЗУЕТ КОНФИГУРАЦИЮ ИЗ @/config
// Все константы можно менять в одном месте!

export type HealthScoreBreakdown = {
    activity: number;
    community: number;
    documentation: number;
    maintenance: number;
    total: number;
};

export type HealthBadge = {
    emoji: string;
    label: string;
    color: string;
    textColor: string;
    bgColor: string;
};

// ============================================
// CALCULATE HEALTH SCORE
// ============================================
export function calculateHealthScore(repo: GitHubRepo): HealthScoreBreakdown {
    let activityScore = 0;
    let communityScore = 0;
    let documentationScore = 0;
    let maintenanceScore = 0;

    // ============================================
    // 1. ACTIVITY SCORE (используем ACTIVITY config)
    // ============================================
    const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(repo.updated_at).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate < ACTIVITY.EXCELLENT_DAYS) {
        activityScore = WEIGHTS.ACTIVITY; // Активно развивается
    } else if (daysSinceUpdate < ACTIVITY.GOOD_DAYS) {
        activityScore = Math.round(WEIGHTS.ACTIVITY * 0.67); // ~20 points
    } else if (daysSinceUpdate < ACTIVITY.FAIR_DAYS) {
        activityScore = Math.round(WEIGHTS.ACTIVITY * 0.33); // ~10 points
    } else {
        activityScore = 0; // Заброшен
    }

    // ============================================
    // 2. COMMUNITY SCORE (используем COMMUNITY config)
    // ============================================
    // Stars weight (0-15 points)
    const starsWeight = Math.min(
        repo.stargazers_count / COMMUNITY.STARS_DIVISOR,
        COMMUNITY.STARS_MAX_POINTS
    );

    // Forks weight (0-15 points)
    const forksWeight = Math.min(
        repo.forks_count / COMMUNITY.FORKS_DIVISOR,
        COMMUNITY.FORKS_MAX_POINTS
    );

    communityScore = Math.round(starsWeight + forksWeight);

    // ============================================
    // 3. DOCUMENTATION SCORE (используем DOCUMENTATION config)
    // ============================================
    if (repo.description) {
        documentationScore += DOCUMENTATION.DESCRIPTION_POINTS;
    }

    if (repo.has_wiki) {
        documentationScore += DOCUMENTATION.WIKI_POINTS;
    }

    if (repo.license) {
        documentationScore += DOCUMENTATION.LICENSE_POINTS;
    }

    // ============================================
    // 4. MAINTENANCE SCORE (используем MAINTENANCE config)
    // ============================================
    const issueRatio = repo.open_issues_count / (repo.stargazers_count || 1);

    if (issueRatio < MAINTENANCE.EXCELLENT_RATIO) {
        maintenanceScore = MAINTENANCE.EXCELLENT_POINTS; // Отлично
    } else if (issueRatio < MAINTENANCE.GOOD_RATIO) {
        maintenanceScore = MAINTENANCE.GOOD_POINTS; // Хорошо
    } else if (issueRatio < MAINTENANCE.FAIR_RATIO) {
        maintenanceScore = MAINTENANCE.FAIR_POINTS; // Средне
    } else {
        maintenanceScore = MAINTENANCE.POOR_POINTS; // Плохо
    }

    // ============================================
    // TOTAL
    // ============================================
    const total =
        activityScore + communityScore + documentationScore + maintenanceScore;

    return {
        activity: activityScore,
        community: communityScore,
        documentation: documentationScore,
        maintenance: maintenanceScore,
        total: Math.min(total, 100), // Не больше 100
    };
}

// ============================================
// GET HEALTH BADGE
// ============================================
export function getHealthBadge(score: number): HealthBadge {
    // Ищем подходящий grade в порядке убывания
    if (score >= GRADES.EXCELLENT.MIN_SCORE) {
        return {
            emoji: GRADES.EXCELLENT.EMOJI,
            label: GRADES.EXCELLENT.LABEL,
            color: GRADES.EXCELLENT.COLOR,
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-500/20 border-green-500/50',
        };
    }

    if (score >= GRADES.GOOD.MIN_SCORE) {
        return {
            emoji: GRADES.GOOD.EMOJI,
            label: GRADES.GOOD.LABEL,
            color: GRADES.GOOD.COLOR,
            textColor: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-500/20 border-yellow-500/50',
        };
    }

    if (score >= GRADES.FAIR.MIN_SCORE) {
        return {
            emoji: GRADES.FAIR.EMOJI,
            label: GRADES.FAIR.LABEL,
            color: GRADES.FAIR.COLOR,
            textColor: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-500/20 border-orange-500/50',
        };
    }

    // POOR (все что меньше FAIR.MIN_SCORE)
    return {
        emoji: GRADES.POOR.EMOJI,
        label: GRADES.POOR.LABEL,
        color: GRADES.POOR.COLOR,
        textColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/20 border-red-500/50',
    };
}
