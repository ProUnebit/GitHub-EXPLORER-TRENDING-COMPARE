import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, BookOpen, Wrench, ScanHeart } from 'lucide-react';
import type { GitHubRepo } from '@/lib/github/types';
import {
    calculateHealthScore,
    getHealthBadge,
    type HealthScoreBreakdown,
} from '@/lib/utils/health-score';

// ============================================
// HEALTH SCORE CARD - Detailed Version
// ============================================
// Полная версия Health Score для детальной страницы
// Показывает breakdown по категориям

type HealthScoreCardProps = {
    repo: GitHubRepo;
};

type MetricRowProps = {
    icon: React.ReactNode;
    label: string;
    score: number;
    max: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
};

function MetricRow({
    icon,
    label,
    score,
    max,
    status,
    description,
}: MetricRowProps) {
    const percentage = (score / max) * 100;

    const statusColors = {
        excellent: 'bg-green-500',
        good: 'bg-yellow-500',
        fair: 'bg-orange-500',
        poor: 'bg-red-500',
    };

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <div className="text-md font-medium">{label}</div>
                        <div className="text-muted-foreground text-xs">
                            {description}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-md font-bold">
                        {score}/{max}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        {percentage.toFixed(0)}%
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                    className={`h-full transition-all duration-500 ${statusColors[status]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export function HealthScoreCard({ repo }: HealthScoreCardProps) {
    const breakdown = calculateHealthScore(repo);
    const badge = getHealthBadge(breakdown.total);

    // Определяем статусы для каждой метрики
    const getStatus = (
        score: number,
        max: number
    ): 'excellent' | 'good' | 'fair' | 'poor' => {
        const percentage = (score / max) * 100;
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'fair';
        return 'poor';
    };

    // Descriptions для каждой метрики
    const getActivityDescription = (score: number): string => {
        if (score === 30) return 'Active development - updated this week';
        if (score === 20) return 'Regular updates - updated this month';
        if (score === 10) return 'Slow updates - updated within 3 months';
        return 'Inactive - no updates in 3+ months';
    };

    const getCommunityDescription = (
        breakdown: HealthScoreBreakdown
    ): string => {
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        return `${stars.toLocaleString()} stars, ${forks.toLocaleString()} forks`;
    };

    const getDocumentationDescription = (score: number): string => {
        const features = [];
        if (repo.description) features.push('description');
        if (repo.has_wiki) features.push('wiki');
        if (repo.license) features.push('license');
        return features.length > 0
            ? `Has ${features.join(', ')}`
            : 'Missing documentation';
    };

    const getMaintenanceDescription = (score: number): string => {
        const ratio = repo.open_issues_count / (repo.stargazers_count || 1);
        return `${(ratio * 100).toFixed(1)}% issue ratio`;
    };

    return (
        <Card className="bg-card dark:border-teal-900/60">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ScanHeart  className="mr-2 inline-block h-5 w-5 text-teal-500" />
                    <span className="font-bold text-teal-600 dark:text-amber-300/80">Repository Health Score</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* ============================================
                    BIG SCORE DISPLAY
                    ============================================ */}
                <div className="text-center">
                    {/* Score */}
                    <div className="mb-2 flex items-center justify-center gap-3">
                        <span className="text-6xl">{badge.emoji}</span>
                        <div className="text-left">
                            <div className="text-foreground text-5xl font-bold">
                                {breakdown.total}
                                <span className="text-muted-foreground text-3xl">
                                    /100
                                </span>
                            </div>
                            <div
                                className={`text-xl font-medium ${badge.textColor}`}
                            >
                                {badge.label}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-muted mx-auto mb-4 h-3 max-w-md overflow-hidden rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 via-teal-500 to-green-500 transition-all duration-700"
                            style={{ width: `${breakdown.total}%` }}
                        />
                    </div>

                    <p className="text-muted-foreground text-sm">
                        Overall repository health assessment
                    </p>
                </div>

                {/* ============================================
                    BREAKDOWN BY CATEGORY
                    ============================================ */}
                <div className="space-y-4">
                    <h4 className="text-muted-foreground text-sm font-semibold">
                        Score Breakdown
                    </h4>

                    {/* Activity */}
                    <MetricRow
                        icon={<Activity className="h-4 w-4 text-orange-500" />}
                        label="Activity"
                        score={breakdown.activity}
                        max={30}
                        status={getStatus(breakdown.activity, 30)}
                        description={getActivityDescription(breakdown.activity)}
                    />

                    {/* Community */}
                    <MetricRow
                        icon={<Users className="h-4 w-4 text-blue-500" />}
                        label="Community"
                        score={breakdown.community}
                        max={30}
                        status={getStatus(breakdown.community, 30)}
                        description={getCommunityDescription(breakdown)}
                    />

                    {/* Documentation */}
                    <MetricRow
                        icon={<BookOpen className="h-4 w-4 text-purple-500" />}
                        label="Documentation"
                        score={breakdown.documentation}
                        max={20}
                        status={getStatus(breakdown.documentation, 20)}
                        description={getDocumentationDescription(
                            breakdown.documentation
                        )}
                    />

                    {/* Maintenance */}
                    <MetricRow
                        icon={<Wrench className="h-4 w-4 text-teal-500" />}
                        label="Maintenance"
                        score={breakdown.maintenance}
                        max={20}
                        status={getStatus(breakdown.maintenance, 20)}
                        description={getMaintenanceDescription(
                            breakdown.maintenance
                        )}
                    />
                </div>

                {/* ============================================
                    INFO FOOTER
                    ============================================ */}
                <div className="text-muted-foreground border-t pt-4 text-center text-xs">
                    Health score is calculated based on activity, community
                    engagement, documentation quality, and maintenance practices
                </div>
            </CardContent>
        </Card>
    );
}
