'use client';

import { ExportButton } from '@/components/ExportButton';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonCharts } from './ComparisonCharts';
import { exportComparisonToPDF } from '@/lib/utils/export';
import { formatDate } from '@/lib/utils/formatters';

// ============================================
// COMPARISON EXPORT WRAPPER - Client Component
// ============================================
// Оборачивает таблицу и графики
// Предоставляет функционал экспорта
//
// Паттерн: Data passed from Server → Client wrapper → Export

type RepoData = {
    fullName: string;
    owner: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    languages: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contributors: any[];
};

type ComparisonExportWrapperProps = {
    repos: RepoData[];
};

export function ComparisonExportWrapper({
    repos,
}: ComparisonExportWrapperProps) {
    const handleExportPDF = () => {
        // Подготовка данных для PDF
        const exportData = {
            repos: repos.map((r) => ({
                name: r.name,
                owner: r.owner,
                stars: r.repo.stargazers_count,
                forks: r.repo.forks_count,
                watchers: r.repo.watchers_count,
                issues: r.repo.open_issues_count,
                contributors: r.contributors.length,
                languages: Object.keys(r.languages).length,
                created: formatDate(r.repo.created_at),
                license: r.repo.license?.spdx_id || 'None',
            })),
        };

        exportComparisonToPDF(exportData);
    };

    return (
        <div className="space-y-8">
            {/* Export Button */}
            <div className="flex justify-end">
                <ExportButton
                    onExportPDF={handleExportPDF}
                    formats={['pdf']}
                    label="Export Comparison"
                />
            </div>

            {/* Content */}
            <ComparisonTable repos={repos} />
            <ComparisonCharts repos={repos} />
        </div>
    );
}
