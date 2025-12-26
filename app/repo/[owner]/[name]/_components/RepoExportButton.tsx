'use client';

import { ExportButton } from '@/components/ExportButton';
import { exportRepoStatsToPDF } from '@/lib/utils/export';
import type { GitHubRepo } from '@/lib/github/types';
import {
    formatDate,
    formatRelativeTime,
    calculateLanguagePercentages,
} from '@/lib/utils/formatters';

// ============================================
// REPO EXPORT BUTTON - Client Component
// ============================================

type RepoExportButtonProps = {
    repo: GitHubRepo;
    contributors: Array<{ login: string; contributions: number }>;
    languages: { [key: string]: number };
};

export function RepoExportButton({
    repo,
    contributors,
    languages,
}: RepoExportButtonProps) {
    const handleExportPDF = () => {
        const languageData = calculateLanguagePercentages(languages);

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
            contributors: contributors.slice(0, 10).map((c) => ({
                login: c.login,
                contributions: c.contributions,
            })),
            languages: languageData.slice(0, 10).map((l) => ({
                name: l.name,
                percentage: l.percentage,
            })),
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
