import { Star, GitFork, Eye, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { GitHubRepo } from '@/lib/github/types';
import { formatNumber } from '@/lib/utils/formatters';
// import { Skeleton } from '@/components/ui/skeleton';

// ============================================
// REPO STATS - Server Component
// ============================================
// Показывает статистику репозитория
//
// Design pattern: Stat Cards Grid
// Легко расширять новыми метриками

type RepoStatsProps = {
    repo: GitHubRepo;
};

export function RepoStats({ repo }: RepoStatsProps) {
    const stats = [
        {
            label: 'Stars',
            value: repo.stargazers_count,
            icon: Star,
            color: 'text-yellow-600',
        },
        {
            label: 'Forks',
            value: repo.forks_count,
            icon: GitFork,
            color: 'text-blue-600',
        },
        {
            label: 'Watchers',
            value: repo.watchers_count,
            icon: Eye,
            color: 'text-green-600',
        },
        {
            label: 'Open Issues',
            value: repo.open_issues_count,
            icon: AlertCircle,
            color: 'text-red-600',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label} className='bg-slate-50'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium text-teal-600">
                                    {stat.label}
                                </p>
                                <p className="mt-2 text-4xl font-bold">
                                    {formatNumber(stat.value)}
                                </p>
                            </div>
                            <stat.icon className={`h-12 w-12 ${stat.color}`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
