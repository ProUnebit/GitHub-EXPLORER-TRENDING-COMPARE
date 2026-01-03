import { Link } from 'next-view-transitions';
import { Star, GitFork, TrendingUp, Circle, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthBadge } from '@/components/HealthBadge'; // ← Добавить
import type { GitHubRepo } from '@/lib/github/types';
import { formatNumber, formatRelativeTime } from '@/lib/utils/formatters';
import { getLanguageColor } from '@/lib/constants/language-colors';

type TrendingCardProps = {
    repo: GitHubRepo;
    rank: number;
};

export function TrendingCard({ repo, rank }: TrendingCardProps) {
    const repoUrl = `/repo/${repo.owner.login}/${repo.name}`;

    return (
        <Card className="bg-card hover:bg-accent relative flex h-full flex-col transition-all hover:border-teal-400 hover:shadow-lg dark:border-teal-900/60 dark:hover:border-teal-400">
            {/* Ranking Badge */}
            <div className="absolute top-4 right-4 z-10">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        rank === 1
                            ? 'h-11 w-11 border-teal-400 bg-yellow-500/80 text-xl text-white dark:border-yellow-500 dark:bg-yellow-600/80'
                            : rank === 2
                              ? 'h-11 w-11 border-teal-400 bg-gray-400/80 text-xl text-white dark:border-gray-400 dark:bg-gray-500/80'
                              : rank === 3
                                ? 'h-11 w-11 border-teal-400 bg-orange-600/80 text-xl text-white dark:border-orange-600 dark:bg-orange-700/80'
                                : 'bg-muted text-muted-foreground border-teal-400'
                    }`}
                >
                    {rank === 1
                        ? '🥇'
                        : rank === 2
                          ? '🥈'
                          : rank === 3
                            ? '🥉'
                            : rank}
                </div>
            </div>

            <CardHeader>
                {/* Repository Name & Health Badge */}
                <div className="flex items-start justify-between gap-2 pr-14">
                    {' '}
                    {/* pr-14 для места под rank badge */}
                    <div className="min-w-0 flex-1">
                        <Link
                            href={repoUrl}
                            className="text-teal-600 hover:underline"
                        >
                            <h3
                                className="line-clamp-1 text-lg font-semibold text-teal-600"
                                style={{
                                    viewTransitionName: `repo-title-${repo.name}`,
                                }}
                            >
                                {repo.name}
                            </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            {repo.owner.login}
                        </p>
                    </div>
                    <HealthBadge repo={repo} showLabel />
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <p className="line-clamp-2 text-sm">
                    {repo.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <GitFork className="dark:text-blue-40 h-4 w-4 text-blue-600" />
                        <span>{formatNumber(repo.forks_count)}</span>
                    </div>

                    {repo.license && (
                        <div className="flex items-center gap-1">
                            <Scale className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            <span className="text-xs">
                                {repo.license.spdx_id}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                            Trending
                        </span>
                    </div>
                </div>

                {/* Language & Updated */}
                <div className="flex items-center justify-between text-xs">
                    {repo.language && (
                        <div className="flex items-center gap-1">
                            <Circle
                                className="h-4 w-4 fill-current"
                                style={{
                                    color: getLanguageColor(repo.language),
                                }}
                            />
                            <span>{repo.language}</span>
                        </div>
                    )}
                    <span className="text-muted-foreground">
                        Updated {formatRelativeTime(repo.updated_at)}
                    </span>
                </div>

                {/* Topics */}
                {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {repo.topics.slice(0, 3).map((topic) => (
                            <Badge
                                key={topic}
                                variant="secondary"
                                className="text-xs"
                            >
                                {topic}
                            </Badge>
                        ))}
                        {repo.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{repo.topics.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
