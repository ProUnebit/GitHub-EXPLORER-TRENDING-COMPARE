import Link from 'next/link';
import { Star, GitFork, Scale, Circle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GitHubRepo } from '@/lib/github/types';
import { formatNumber, formatRelativeTime } from '@/lib/utils/formatters';

// ============================================
// REPO CARD COMPONENT (Server Component)
// ============================================
// Это Server Component потому что:
// - Нет интерактивности (onClick, useState и т.д.)
// - Просто отображение данных
// - Может быть статически сгенерирован

type RepoCardProps = {
    repo: GitHubRepo;
};

export function RepoCard({ repo }: RepoCardProps) {
    // ============================================
    // DATA TRANSFORMATION
    // ============================================
    // Подготавливаем данные для отображения
    // Это можно легко unit-тестировать

    const repoUrl = `/repo/${repo.owner.login}/${repo.name}`;

    return (
        <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
                {/* Repository Name - это Link (Client Component от Next.js) */}
                {/* Next.js Link - оптимизированная навигация с prefetch */}
                <CardTitle className="line-clamp-1">
                    <Link href={repoUrl} className="hover:underline">
                        {repo.name}
                    </Link>
                </CardTitle>

                {/* Owner */}
                <CardDescription className="flex items-center gap-2">
                    <span className="text-xs">{repo.owner.login}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                {/* Description */}
                <p className="text-muted-foreground line-clamp-2 text-sm">
                    {repo.description || 'No description available'}
                </p>

                {/* Stats */}
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>

                    {/* Forks */}
                    <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{formatNumber(repo.forks_count)}</span>
                    </div>

                    {/* License */}
                    {repo.license && (
                        <div className="flex items-center gap-1">
                            <Scale className="h-4 w-4" />
                            <span className="text-xs">
                                {repo.license.spdx_id}
                            </span>
                        </div>
                    )}
                </div>

                {/* Language & Updated */}
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                    {repo.language && (
                        <div className="flex items-center gap-1">
                            <Circle className="h-2 w-2 fill-current" />
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
