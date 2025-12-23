import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getRepository } from '@/lib/github/api';
import { RepoHeader } from './_components/RepoHeader';
import { RepoStats } from './_components/RepoStats';
import { LanguageChart } from './_components/LanguageChart';
import { ContributorsList } from './_components/ContributorsList';
import { RecentCommits } from './_components/RecentCommits';
import { RepoSkeleton } from './_components/RepoSkeleton';

// ============================================
// METADATA GENERATION (SEO)
// ============================================
// Next.js вызывает эту функцию для генерации <head>
// Выполняется на сервере, можно делать fetch

type PageProps = {
    params: Promise<{ owner: string; name: string }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { owner, name } = await params;

    try {
        const repo = await getRepository(owner, name);

        return {
            title: `${repo.full_name} - GitHub Explorer`,
            description:
                repo.description || `GitHub repository ${repo.full_name}`,
            keywords: [owner, name, 'github', 'repository', ...repo.topics],
        };
    } catch {
        return {
            title: `${owner}/${name} - GitHub Explorer`,
            description: 'Repository not found',
        };
    }
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
// Паттерн: "Fast then Slow"
// 1. Грузим критичные данные сразу (repo info)
// 2. Остальное через Suspense (стримится позже)

export default async function RepoPage({ params }: PageProps) {
    const { owner, name } = await params;

    // ============================================
    // CRITICAL DATA - загружаем сразу
    // ============================================
    // Основная инфа о репозитории нужна для layout
    // Грузим ДО рендера, блокируем страницу
    // Почему: без этих данных страница бессмысленна

    const repo = await getRepository(owner, name);

    return (
        <div className="container mx-auto space-y-8 py-8">
            {/* Back Button */}
            <Link
                href="/"
                className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to search
            </Link>

            {/* ============================================
          INSTANT RENDER - данные уже есть
          ============================================ */}
            <RepoHeader repo={repo} />
            <RepoStats repo={repo} />

            {/* ============================================
          STREAMING SECTIONS - грузятся параллельно
          ============================================
          Каждый <Suspense> - независимая граница
          Пока грузится → показываем skeleton
          Когда готов → React заменяет skeleton на контент
          
          Почему отдельные Suspense:
          1. Параллельная загрузка (не ждем друг друга)
          2. Пользователь видит прогресс
          3. Если одна секция упала → остальные работают
      */}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Language Chart */}
                <Suspense fallback={<RepoSkeleton.Chart />}>
                    <LanguageChart owner={owner} name={name} />
                </Suspense>

                {/* Contributors */}
                <Suspense fallback={<RepoSkeleton.Contributors />}>
                    <ContributorsList owner={owner} name={name} />
                </Suspense>
            </div>

            {/* Recent Commits */}
            <Suspense fallback={<RepoSkeleton.Commits />}>
                <RecentCommits owner={owner} name={name} />
            </Suspense>
        </div>
    );
}
