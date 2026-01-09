'use client';

import { ExportButton } from '@/components/ExportButton';
import { exportTrendingToCSV } from '@/lib/utils/export';
import type { GitHubRepo } from '@/lib/github/types';

type TrendingExportButtonProps = {
    repos: GitHubRepo[];
    since: 'daily' | 'weekly' | 'monthly';
    language?: string;
};

export function TrendingExportButton({
    repos,
    since,
    language,
}: TrendingExportButtonProps) {
    const handleExportCSV = () => {
        const exportData = {
            repos: repos.map((repo, index) => ({
                rank: index + 1,
                name: repo.name,
                owner: repo.owner.login,
                description: repo.description || '',
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language || 'N/A',
                url: repo.html_url,
            })),
            since,
            language,
        };

        exportTrendingToCSV(exportData);
    };

    return (
        <ExportButton
            onExportCSV={handleExportCSV}
            formats={['csv']}
            label="Export List"
        />
    );
}
