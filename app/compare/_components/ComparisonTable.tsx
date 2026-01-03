/* eslint-disable @typescript-eslint/no-explicit-any */
// import Link from 'next/link';
import { Link } from 'next-view-transitions';
import {
    Star,
    GitFork,
    Eye,
    Bug,
    Users,
    Calendar,
    Scale,
    CodeXml,
    TableProperties,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    formatNumber,
    formatDate,
    formatRelativeTime,
} from '@/lib/utils/formatters';

// ============================================
// COMPARISON TABLE - Server Component
// ============================================
// Side-by-side таблица сравнения метрик
//
// Функционал:
// - Определение "победителя" по каждой метрике
// - Цветовая индикация (winner = зеленый)
// - Responsive layout (grid на desktop, stack на mobile)
//
// Метрики:
// - Stars, Forks, Watchers, Issues
// - Contributors, Languages
// - Dates, License

type RepoData = {
    fullName: string;
    owner: string;
    name: string;
    repo: any;
    languages: any;
    contributors: any[];
};

type ComparisonTableProps = {
    repos: RepoData[];
};

// Helper для определения победителя
function getWinnerIndex(values: number[]): number {
    return values.indexOf(Math.max(...values));
}

export function ComparisonTable({ repos }: ComparisonTableProps) {
    // ============================================
    // PREPARE DATA FOR COMPARISON
    // ============================================
    const stars = repos.map((r) => r.repo.stargazers_count);
    const forks = repos.map((r) => r.repo.forks_count);
    const watchers = repos.map((r) => r.repo.watchers_count);
    // const issues = repos.map((r) => r.repo.open_issues_count);
    const contributorsCount = repos.map((r) => r.contributors.length);
    const languagesCount = repos.map((r) => Object.keys(r.languages).length);
    const createdDates = repos.map((r) =>
        new Date(r.repo.created_at).getTime()
    );

    // Winners indices
    const starWinner = getWinnerIndex(stars);
    const forkWinner = getWinnerIndex(forks);
    const watcherWinner = getWinnerIndex(watchers);
    const contributorWinner = getWinnerIndex(contributorsCount);
    const languageWinner = getWinnerIndex(languagesCount);
    const oldestIndex = createdDates.indexOf(Math.min(...createdDates));

    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <TableProperties className="mr-2 inline-block h-5 w-5 text-teal-500" />
                    <span className="font-bold text-teal-600 dark:text-amber-300/80">
                        Metrics Comparison
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-muted-foreground p-4 text-left font-semibold">
                                    REPOSITORIES
                                </th>
                                {repos.map((repo) => (
                                    <th
                                        key={repo.fullName}
                                        className="p-4 text-center"
                                    >
                                        <Link
                                            href={`/repo/${repo.owner}/${repo.name}`}
                                            className="text-2xl font-bold text-teal-600 hover:underline"
                                        >
                                            <p
                                                style={{
                                                    viewTransitionName: `repo-title-${repo.name}`,
                                                }}
                                            >
                                                {repo.name}
                                            </p>
                                        </Link>
                                        <p className="text-muted-foreground mt-1 text-xs font-normal">
                                            {repo.owner}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Stars */}
                            <MetricRow
                                icon={
                                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                }
                                label="Stars"
                                values={repos.map((r, i) => ({
                                    value: formatNumber(
                                        r.repo.stargazers_count
                                    ),
                                    isWinner: i === starWinner,
                                }))}
                            />

                            {/* Forks */}
                            <MetricRow
                                icon={
                                    <GitFork className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                }
                                label="Forks"
                                values={repos.map((r, i) => ({
                                    value: formatNumber(r.repo.forks_count),
                                    isWinner: i === forkWinner,
                                }))}
                            />

                            {/* Watchers */}
                            <MetricRow
                                icon={
                                    <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                                }
                                label="Watchers"
                                values={repos.map((r, i) => ({
                                    value: formatNumber(r.repo.watchers_count),
                                    isWinner: i === watcherWinner,
                                }))}
                            />

                            {/* Open Issues */}
                            <MetricRow
                                icon={
                                    <Bug className="h-4 w-4 text-red-600 dark:text-red-400" />
                                }
                                label="Open Issues"
                                values={repos.map((r) => ({
                                    value: formatNumber(
                                        r.repo.open_issues_count
                                    ),
                                    isWinner: false, // Меньше = лучше, но не показываем winner
                                }))}
                            />

                            {/* Contributors */}
                            <MetricRow
                                icon={
                                    <Users className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                                }
                                label="Contributors"
                                values={repos.map((r, i) => ({
                                    value:
                                        r.contributors.length.toString() + '+',
                                    isWinner: i === contributorWinner,
                                }))}
                            />

                            {/* Languages */}
                            <MetricRow
                                icon={
                                    <CodeXml className="h-4 w-4 text-teal-500" />
                                }
                                label="Languages"
                                values={repos.map((r, i) => ({
                                    value: Object.keys(
                                        r.languages
                                    ).length.toString(),
                                    isWinner: i === languageWinner,
                                }))}
                            />

                            {/* Created Date */}
                            <MetricRow
                                icon={
                                    <Calendar className="h-4 w-4 text-lime-600 dark:text-lime-600" />
                                }
                                label="Created"
                                values={repos.map((r, i) => ({
                                    value: formatDate(r.repo.created_at),
                                    isWinner: i === oldestIndex,
                                    subtitle: formatRelativeTime(
                                        r.repo.created_at
                                    ),
                                }))}
                            />

                            {/* Last Updated */}
                            <MetricRow
                                icon={
                                    <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-600" />
                                }
                                label="Last Updated"
                                values={repos.map((r) => ({
                                    value: formatRelativeTime(
                                        r.repo.updated_at
                                    ),
                                    isWinner: false,
                                }))}
                            />

                            {/* License */}
                            <MetricRow
                                icon={
                                    <Scale className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                                }
                                label="License"
                                values={repos.map((r) => ({
                                    value: r.repo.license?.spdx_id || 'None',
                                    isWinner: false,
                                }))}
                            />
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================
// METRIC ROW COMPONENT
// ============================================
// Переиспользуемая строка таблицы
function MetricRow({
    icon,
    label,
    values,
}: {
    icon: React.ReactNode;
    label: string;
    values: Array<{
        value: string;
        isWinner: boolean;
        subtitle?: string;
    }>;
}) {
    return (
        <tr className="hover:bg-accent/30 border-b transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-2 font-medium">
                    {icon}
                    {label}
                </div>
            </td>
            {values.map((val, i) => (
                <td
                    key={i}
                    className={`p-4 text-center ${
                        val.isWinner
                            ? 'bg-green-100 font-bold text-green-700 dark:bg-green-950/50 dark:text-green-400'
                            : ''
                    }`}
                >
                    <div>
                        {val.value}
                        {val.isWinner && (
                            <span className="ml-2 text-xl">🏆</span>
                        )}
                    </div>
                    {val.subtitle && (
                        <div className="text-muted-foreground mt-1 text-xs">
                            {val.subtitle}
                        </div>
                    )}
                </td>
            ))}
        </tr>
    );
}
