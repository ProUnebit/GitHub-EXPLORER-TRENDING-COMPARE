import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getRepository, getContributors, getLanguages } from '@/lib/github/api';
import { RepoHeader } from './_components/RepoHeader';
import { RepoStats } from './_components/RepoStats';
import { LanguageChart } from './_components/LanguageChart';
import { ContributorsList } from './_components/ContributorsList';
import { RecentCommits } from './_components/RecentCommits';
import { RepoSkeleton } from './_components/RepoSkeleton';
import { RepoExportButton } from './_components/RepoExportButton';

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

export default async function RepoPage({ params }: PageProps) {
    const { owner, name } = await params;

    // Fetch critical data + data for export
    const [repo, contributors, languages] = await Promise.all([
        getRepository(owner, name),
        getContributors(owner, name, 100),
        getLanguages(owner, name),
    ]);

    return (
        <div className="container mx-auto space-y-8 py-8">
            {/* Back Button */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
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
            />
            <RepoStats repo={repo} />

            <div className="grid gap-8 lg:grid-cols-2">
                <Suspense fallback={<RepoSkeleton.Chart />}>
                    <LanguageChart owner={owner} name={name} />
                </Suspense>

                <Suspense fallback={<RepoSkeleton.Contributors />}>
                    <ContributorsList owner={owner} name={name} />
                </Suspense>
            </div>

            <Suspense fallback={<RepoSkeleton.Commits />}>
                <RecentCommits owner={owner} name={name} />
            </Suspense>
        </div>
    );
}
