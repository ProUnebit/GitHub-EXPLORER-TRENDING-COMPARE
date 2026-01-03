import type { GitHubRepo } from '@/lib/github/types';

// ============================================
// HEALTH SCORE CALCULATOR
// ============================================
// Вычисляет "здоровье" репозитория (0-100)
//
// Категории:
// - Activity (30 points): Как давно обновлялся
// - Community (30 points): Stars + Forks
// - Documentation (20 points): Description + Wiki + License
// - Maintenance (20 points): Issue ratio

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
    // 1. ACTIVITY SCORE (30 points)
    // ============================================
    const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(repo.updated_at).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate < 7) {
        activityScore = 30; // Активно развивается
    } else if (daysSinceUpdate < 30) {
        activityScore = 20; // Обновлялся в течение месяца
    } else if (daysSinceUpdate < 90) {
        activityScore = 10; // Обновлялся в течение 3 месяцев
    } else {
        activityScore = 0; // Заброшен
    }

    // ============================================
    // 2. COMMUNITY SCORE (30 points)
    // ============================================
    // Stars weight (0-15 points)
    const starsWeight = Math.min(repo.stargazers_count / 1000, 15);

    // Forks weight (0-15 points)
    const forksWeight = Math.min(repo.forks_count / 100, 15);

    communityScore = Math.round(starsWeight + forksWeight);

    // ============================================
    // 3. DOCUMENTATION SCORE (20 points)
    // ============================================
    if (repo.description) {
        documentationScore += 10;
    }

    if (repo.has_wiki) {
        documentationScore += 5;
    }

    if (repo.license) {
        documentationScore += 5;
    }

    // ============================================
    // 4. MAINTENANCE SCORE (20 points)
    // ============================================
    const issueRatio = repo.open_issues_count / (repo.stargazers_count || 1);

    if (issueRatio < 0.05) {
        maintenanceScore = 20; // Отлично
    } else if (issueRatio < 0.1) {
        maintenanceScore = 15; // Хорошо
    } else if (issueRatio < 0.2) {
        maintenanceScore = 10; // Средне
    } else {
        maintenanceScore = 5; // Плохо
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
    if (score >= 90) {
        return {
            emoji: '💚',
            label: 'Excellent',
            color: 'green',
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-500/20 border-green-500/50',
        };
    }

    if (score >= 70) {
        return {
            emoji: '💛',
            label: 'Good',
            color: 'yellow',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-500/20 border-yellow-500/50',
        };
    }

    if (score >= 50) {
        return {
            emoji: '🧡',
            label: 'Fair',
            color: 'orange',
            textColor: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-500/20 border-orange-500/50',
        };
    }

    return {
        emoji: '❤️',
        label: 'Poor',
        color: 'red',
        textColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/20 border-red-500/50',
    };
}
