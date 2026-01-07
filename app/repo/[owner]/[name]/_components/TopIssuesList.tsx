// app/repo/[owner]/[name]/_components/TopIssuesList.tsx

/**
 * ============================================
 * TOP ISSUES LIST
 * ============================================
 * 
 * Список самых "горячих" issues
 * 
 * Сортировка по:
 * - Количество комментариев
 * - Количество реакций
 * 
 * Показывает:
 * - Номер и название issue
 * - Метки (labels)
 * - Комментарии + реакции
 * - Ссылка на GitHub
 * 
 * Server Component - статичные данные
 */

import type { GitHubIssue } from '@/lib/github/types';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type TopIssuesListProps = {
    issues: GitHubIssue[];
};

// ============================================
// HELPER: Get label color class
// ============================================
// ПОЧЕМУ ФУНКЦИЯ: GitHub дает hex, нужно определить светлый/темный для текста
function getLabelTextColor(hexColor: string): string {
    // Убираем # если есть
    const hex = hexColor.replace('#', '');
    
    // Парсим RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Формула яркости: https://www.w3.org/TR/AERT/#color-contrast
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Если светлый фон - темный текст, и наоборот
    return brightness > 155 ? '#000000' : '#ffffff';
}

// ============================================
// COMPONENT
// ============================================
export function TopIssuesList({ issues }: TopIssuesListProps) {
    if (issues.length === 0) {
        return (
            <div className="text-muted-foreground text-center text-sm py-8">
                No issues found
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {issues.map((issue, index) => (
                <div
                    key={issue.id}
                    className="group rounded-lg border bg-card p-3 transition-all hover:border-teal-400 dark:border-teal-900/60 bg-linear-to-br from-background to-muted/20
                         duration-200 hover:shadow-md"
                >
                    {/* ============================================ */}
                    {/* HEADER - Issue number + title */}
                    {/* ============================================ */}
                    <div className="mb-2 flex items-start gap-2">
                        {/* Rank badge */}
                        <div className="shrink-0">
                            <div
                                className={`
                                    flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                                    ${
                                        index === 0
                                            ? 'bg-yellow-500 text-white'
                                            : index === 1
                                              ? 'bg-gray-500 text-white'
                                              : index === 2
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-muted text-muted-foreground'
                                    }
                                `}
                            >
                                {index + 1}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="min-w-0 flex-1">
                            <Link
                                href={issue.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link flex items-start gap-1 text-sm font-medium leading-tight transition-colors hover:text-teal-600 dark:hover:text-amber-300"
                            >
                                <span className="line-clamp-2">
                                    #{issue.number} {issue.title}
                                </span>
                                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
                            </Link>
                        </div>
                    </div>

                    {/* ============================================ */}
                    {/* LABELS */}
                    {/* ============================================ */}
                    {issue.labels.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                            {issue.labels.slice(0, 3).map((label) => (
                                <Badge
                                    key={label.id}
                                    variant="outline"
                                    className="text-xs px-2 py-0"
                                    style={{
                                        backgroundColor: `#${label.color}`,
                                        color: getLabelTextColor(label.color),
                                        borderColor: `#${label.color}`,
                                    }}
                                >
                                    {label.name}
                                </Badge>
                            ))}
                            {issue.labels.length > 3 && (
                                <Badge variant="secondary" className="text-xs px-2 py-0">
                                    +{issue.labels.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* ============================================ */}
                    {/* STATS - Comments + Reactions */}
                    {/* ============================================ */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {/* Comments */}
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{issue.comments}</span>
                        </div>

                        {/* Reactions */}
                        {issue.reactions.total_count > 0 && (
                            <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{issue.reactions.total_count}</span>
                            </div>
                        )}

                        {/* State badge */}
                        <div className="ml-auto">
                            <Badge
                                variant={issue.state === 'open' ? 'default' : 'secondary'}
                                className={`text-xs ${
                                    issue.state === 'open'
                                        ? 'bg-orange-500 hover:bg-orange-600'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {issue.state}
                            </Badge>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
