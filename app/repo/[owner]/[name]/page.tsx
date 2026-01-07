import { Suspense } from 'react';
import { Link } from 'next-view-transitions';
import { ArrowLeft } from 'lucide-react';
import { getRepository, getContributors, getLanguages, getCommits, getIssuesAnalytics, getPackageJson } from '@/lib/github/api';
import { RepoHeader } from './_components/RepoHeader';
import { RepoStats } from './_components/RepoStats';
import { HealthScoreCard } from './_components/HealthScoreCard';
import { LanguageChart } from './_components/LanguageChart';
import { ContributorsList } from './_components/ContributorsList';
import { RecentCommits } from './_components/RecentCommits';
import { RepoSkeleton } from './_components/RepoSkeleton';
import { RepoExportButton } from './_components/RepoExportButton';
import { IssuesAnalytics } from './_components/IssuesAnalytics';
import { Metadata } from 'next/types';
import { DependencyAnalysis } from './_components/DependencyAnalysis';

type PageProps = {
    params: Promise<{ owner: string; name: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { owner, name } = await params;

    try {
        const repo = await getRepository(owner, name);

        const title = `${repo.full_name} - GitHub Explorer`;
        const description =
            repo.description ||
            `Explore ${repo.full_name} repository on GitHub - ${repo.stargazers_count.toLocaleString()} stars, ${repo.forks_count.toLocaleString()} forks`;

        const keywords = [
            owner,
            name,
            repo.language || '',
            'github',
            'repository',
            'open source',
            ...repo.topics,
        ].filter(Boolean);

        return {
            title,
            description,
            keywords,

            openGraph: {
                type: 'website',
                title,
                description,
                images: [
                    {
                        url: repo.owner.avatar_url,
                        width: 400,
                        height: 400,
                        alt: `${owner} avatar`,
                    },
                ],
                url: `/repo/${owner}/${name}`,
            },

            twitter: {
                card: 'summary',
                title,
                description,
                images: [repo.owner.avatar_url],
            },

            alternates: {
                canonical: `/repo/${owner}/${name}`,
            },
        };
    } catch {
        return {
            title: `${owner}/${name} - Repository Not Found`,
            description:
                'The requested repository could not be found or is private',
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function RepoPage({ params }: PageProps) {
    const { owner, name } = await params;

    // Получаем все данные параллельно для экспорта
    const [repo, contributors, languages, commits, issuesAnalytics, packageJson] = await Promise.all([
        getRepository(owner, name),
        getContributors(owner, name, 100),
        getLanguages(owner, name),
        getCommits(owner, name, 10), // ✅ Добавил commits
        getIssuesAnalytics(owner, name), // ✅ Добавил issues analytics
        getPackageJson(owner, name), // ✅ Добавил для dependencies
    ]);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: repo.name,
        description: repo.description,
        author: {
            '@type': 'Person',
            name: repo.owner.login,
            url: `https://github.com/${repo.owner.login}`,
        },
        programmingLanguage: repo.language || 'Multiple',
        codeRepository: repo.html_url,
        dateCreated: repo.created_at,
        dateModified: repo.updated_at,
        license: repo.license?.spdx_id,
        keywords: repo.topics.join(', '),
        interactionStatistic: [
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/LikeAction',
                userInteractionCount: repo.stargazers_count,
            },
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ShareAction',
                userInteractionCount: repo.forks_count,
            },
        ],
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            {/* Page Content */}
            <div className="container mx-auto space-y-8 py-8">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href={`/?q=${name}`}
                        className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to search
                    </Link>
                </div>

                <RepoHeader repo={repo} />
                <RepoExportButton
                    repo={repo}
                    contributors={contributors}
                    languages={languages}
                    commits={commits}
                    issuesAnalytics={issuesAnalytics}
                    packageJson={packageJson}
                />
                <RepoStats repo={repo} />

                {/* ROW 1: Health Score | Languages | Dependencies */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <HealthScoreCard repo={repo} />
                    <Suspense fallback={<RepoSkeleton.Chart />}>
                        <LanguageChart owner={owner} name={name} />
                    </Suspense>
                    <Suspense fallback={<RepoSkeleton.Chart />}>
                        <DependencyAnalysis owner={owner} name={name} />
                    </Suspense>
                </div>

                {/* Issues Analytics */}
                <Suspense fallback={<RepoSkeleton.IssuesAnalytics />}>
                    <IssuesAnalytics owner={owner} name={name} />
                </Suspense>

                {/* ============================================ */}
                {/* COMMUNITY & ACTIVITY */}
                {/* Recent Commits: 2/3 ширины, Contributors: 1/3 */}
                {/* ============================================ */}
                <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                    {/* Recent Commits - занимает 2 колонки */}
                    <div className="lg:col-span-2">
                        <Suspense fallback={<RepoSkeleton.Commits />}>
                            <RecentCommits owner={owner} name={name} />
                        </Suspense>
                    </div>
                    
                    {/* Contributors - занимает 1 колонку */}
                    <Suspense fallback={<RepoSkeleton.Contributors />}>
                        <ContributorsList owner={owner} name={name} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
