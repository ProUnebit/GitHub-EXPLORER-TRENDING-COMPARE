import Link from 'next/link';
import { ExternalLink, GitFork, Star, Eye, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GitHubRepo } from '@/lib/github/types';
import { formatNumber, formatDate } from '@/lib/utils/formatters';

// ============================================
// REPO HEADER - Server Component
// ============================================
// Отображает основную информацию о репозитории
//
// Почему Server Component:
// - Нет интерактивности
// - Просто рендер данных
// - Можно статически сгенерировать

type RepoHeaderProps = {
    repo: GitHubRepo;
};

export function RepoHeader({ repo }: RepoHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Repository Name & Owner */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-teal-600">
                        {repo.name}
                    </h1>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <Link
                            href={repo.owner.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors dark:text-amber-300/80 dark:hover:text-amber-300"
                        >
                            {repo.owner.login}
                        </Link>
                        <span>•</span>
                        <span className="text-md font-semibold text-slate-500">
                            {repo.visibility === 'public'
                                ? 'PUBLIC'
                                : 'PRIVATE'}
                        </span>
                    </div>
                </div>

                {/* External Link Button */}
                <Button asChild variant="outline" className='hover:border-teal-400 bg-stone-50 hover:bg-slate-50 dark:hover:border-teal-500 dark:hover:bg-accent'>
                    <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ExternalLink className="mr-2 h-4 w-4 text-teal-600" />
                        View on GitHub
                    </Link>
                </Button>
            </div>

            {/* Description */}
            {repo.description && (
                <p className="max-w-3xl text-lg">
                    {repo.description}
                </p>
            )}

            {/* Topics */}
            {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className='font-semibold bg-stone-600/50 text-white rounded-md'>
                            {topic}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Metadata Row */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
                {/* License */}
                {repo.license && (
                    <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                        <span>{repo.license.name}</span>
                    </div>
                )}

                {/* Created Date */}
                <div>Created on {formatDate(repo.created_at)}</div>

                {/* Last Updated */}
                <div>Updated on {formatDate(repo.updated_at)}</div>
            </div>
        </div>
    );
}
