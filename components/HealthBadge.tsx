import type { GitHubRepo } from '@/lib/github/types';
import { calculateHealthScore, getHealthBadge } from '@/lib/utils/health-score';

// ============================================
// HEALTH BADGE - Compact version для карточек
// ============================================
// Маленький badge с emoji и оценкой
// Используется в RepoCard и TrendingCard

type HealthBadgeProps = {
    repo: GitHubRepo;
    showLabel?: boolean; // Показывать ли текстовый label
};

export function HealthBadge({ repo, showLabel = false }: HealthBadgeProps) {
    const score = calculateHealthScore(repo);
    const badge = getHealthBadge(score.total);

    return (
        <div
            className={`flex items-end gap-1 rounded-full border px-2.5 py-2 ${badge.bgColor} select-none opacity-80 hover:opacity-100 transition-opacity`}
            title={`Health Score: ${score.total}/100 - ${badge.label}`}
        >
            <span className="text-base leading-none">{badge.emoji}</span>
            <span className={`text-xs font-bold ${badge.textColor}`}>
                {score.total}
            </span>
            {showLabel && (
                <span className={`text-xs font-medium ${badge.textColor}`}>
                    {badge.label}
                </span>
            )}
        </div>
    );
}
