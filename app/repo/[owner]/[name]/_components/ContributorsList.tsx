import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContributors } from '@/lib/github/api';
import { formatNumber } from '@/lib/utils/formatters';

// ============================================
// CONTRIBUTORS LIST - Server Component
// ============================================
// Показывает топ контрибьюторов репозитория
//
// Паттерн: Server-side data fetching
// - Fetch на сервере (кеширование автоматическое)
// - Next.js Image для оптимизации аватаров
// - Простой UI, без интерактивности
//
// Архитектурное решение:
// - Оборачиваем в Suspense в page.tsx
// - Если fetch медленный → показываем skeleton
// - Не блокируем рендер всей страницы

type ContributorsListProps = {
    owner: string;
    name: string;
};

export async function ContributorsList({ owner, name }: ContributorsListProps) {
    // ============================================
    // DATA FETCHING
    // ============================================
    // Топ-10 контрибьюторов
    // GitHub API сортирует по количеству коммитов

    const contributors = await getContributors(owner, name, 10);

    // Edge case: нет контрибьюторов
    if (contributors.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-8 text-center text-sm">
                        No contributors data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card dark:border-teal-900/60">
            <CardHeader>
                <CardTitle className="text-teal-600 dark:text-amber-300/80">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {contributors.map((contributor, index) => (
                        <div
                            key={contributor.id}
                            className="flex items-center justify-between"
                        >
                            {/* Contributor Info */}
                            <div className="flex items-center gap-3">
                                {/* Rank Badge */}
                                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                                    {index + 1}
                                </div>

                                {/* Avatar */}
                                <Link
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative h-10 w-10 overflow-hidden rounded-full transition-all hover:ring-4 hover:ring-teal-400"
                                >
                                    <Image
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </Link>

                                {/* Username */}
                                <div>
                                    <Link
                                        href={contributor.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium hover:underline"
                                    >
                                        {contributor.login}
                                    </Link>
                                    <p className="text-muted-foreground text-xs">
                                        {contributor.type}
                                    </p>
                                </div>
                            </div>

                            {/* Contributions Count */}
                            <div className="text-right">
                                <p className="font-semibold">
                                    {formatNumber(contributor.contributions)}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    commits
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}