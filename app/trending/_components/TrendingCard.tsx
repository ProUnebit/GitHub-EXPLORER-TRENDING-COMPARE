import Link from 'next/link';
import { Star, GitFork, TrendingUp, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GitHubRepo } from '@/lib/github/types';
import { formatNumber, formatRelativeTime } from '@/lib/utils/formatters';
import { getLanguageColor } from '@/lib/constants/language-colors'; // ← Добавь

type TrendingCardProps = {
    repo: GitHubRepo;
    rank: number;
};

export function TrendingCard({ repo, rank }: TrendingCardProps) {
    const repoUrl = `/repo/${repo.owner.login}/${repo.name}`;

    return (
        <Card className="transition-border transition-bg relative flex h-full flex-col bg-stone-50 transition-shadow hover:border-teal-400 hover:bg-slate-50 hover:shadow-lg">
            {/* Ranking Badge */}
            <div className="absolute top-4 right-4">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-400 text-sm font-bold ${rank === 1 ? 'h-11 w-11 bg-yellow-500/60 text-xl text-white' : ''} ${rank === 2 ? 'h-11 w-11 bg-gray-400/60 text-xl text-white' : ''} ${rank === 3 ? 'h-11 w-11 bg-orange-600/60 text-xl text-white' : ''} ${rank > 3 ? 'bg-muted text-muted-foreground' : ''} `}
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
                <div className="pr-10">
                    <Link href={repoUrl} className="hover:underline">
                        <h3 className="line-clamp-1 text-lg font-semibold text-teal-600">
                            {repo.name}
                        </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm text-stone-500">
                        {repo.owner.login}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                    {repo.description || 'No description available'}
                </p>

                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{formatNumber(repo.forks_count)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                            Trending
                        </span>
                    </div>
                </div>

                {/* Language & Updated */}
                <div className="text-muted-foreground flex items-center justify-between text-xs">
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
                    <span>Updated {formatRelativeTime(repo.updated_at)}</span>
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
