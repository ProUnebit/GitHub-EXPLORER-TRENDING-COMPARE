'use client';

import { ExportButton } from '@/components/ExportButton';
import { exportRepoStatsToPDF } from '@/lib/utils/export';
import type { GitHubRepo, GitHubCommit, IssuesAnalytics } from '@/lib/github/types';
import {
    formatDate,
    formatRelativeTime,
    calculateLanguagePercentages,
} from '@/lib/utils/formatters';
import { calculateHealthScore, getHealthBadge } from '@/lib/utils/health-score';

// ============================================
// REPO EXPORT BUTTON - Client Component
// ============================================

type RepoExportButtonProps = {
    repo: GitHubRepo;
    contributors: Array<{ login: string; contributions: number }>;
    languages: { [key: string]: number };
    commits: GitHubCommit[]; // ✅ Добавил
    issuesAnalytics: IssuesAnalytics; // ✅ Добавил
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    packageJson: any | null; // ✅ Добавил
};

export function RepoExportButton({
    repo,
    contributors,
    languages,
    commits,
    issuesAnalytics,
    packageJson,
}: RepoExportButtonProps) {
    const handleExportPDF = () => {
        const languageData = calculateLanguagePercentages(languages);
        
        // Рассчитываем Health Score
        const healthScoreBreakdown = calculateHealthScore(repo);
        const healthBadge = getHealthBadge(healthScoreBreakdown.total);
        
        const healthScore = {
            score: healthScoreBreakdown.total,
            grade: healthBadge.label, // Excellent, Good, Fair, Poor
            factors: {
                activity: healthScoreBreakdown.activity,
                community: healthScoreBreakdown.community,
                maintenance: healthScoreBreakdown.maintenance,
                documentation: healthScoreBreakdown.documentation,
            },
        };

        // Подготавливаем данные dependencies
        const dependencies = packageJson
            ? {
                  total:
                      Object.keys(packageJson.dependencies || {}).length +
                      Object.keys(packageJson.devDependencies || {}).length,
                  prod: Object.keys(packageJson.dependencies || {}).length,
                  dev: Object.keys(packageJson.devDependencies || {}).length,
              }
            : null;

        const exportData = {
            name: repo.name,
            owner: repo.owner.login,
            description: repo.description || 'No description',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            issues: repo.open_issues_count,
            language: repo.language || 'N/A',
            license: repo.license?.name || 'None',
            created: formatDate(repo.created_at),
            updated: formatRelativeTime(repo.updated_at),
            healthScore, // ✅ Добавил
            contributors: contributors.slice(0, 10).map((c) => ({
                login: c.login,
                contributions: c.contributions,
            })),
            languages: languageData.slice(0, 10).map((l) => ({
                name: l.name,
                percentage: l.percentage,
            })),
            recentCommits: commits.slice(0, 5).map((c) => ({ // ✅ Добавил
                message: c.commit.message.split('\n')[0], // Первая строка
                author: c.commit.author.name,
                date: formatDate(c.commit.author.date),
            })),
            issuesAnalytics: { // ✅ Добавил
                total: issuesAnalytics.total,
                open: issuesAnalytics.open,
                closed: issuesAnalytics.closed,
                avgCloseTime: issuesAnalytics.avgCloseTime,
                topLabels: issuesAnalytics.topLabels.slice(0, 5),
            },
            dependencies, // ✅ Добавил
        };

        exportRepoStatsToPDF(exportData);
    };

    return (
        <ExportButton
            onExportPDF={handleExportPDF}
            formats={['pdf']}
            label="Export Stats"
        />
    );
}
