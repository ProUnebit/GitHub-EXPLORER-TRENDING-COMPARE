import { Suspense } from 'react';
import { RepoSelector } from './_components/RepoSelector';
import { ComparisonView } from './_components/ComparisonView';
import { ComparisonSkeleton } from './_components/ComparisonSkeleton';
import { ChartBarStacked  } from 'lucide-react'

// ============================================
// METADATA
// ============================================
export const metadata = {
    title: 'Compare Repositories - GitHub Explorer',
    description: 'Compare multiple GitHub repositories side-by-side',
};

// ============================================
// COMPARE PAGE
// ============================================
// Паттерн: URL-driven comparison
// - Selector изменяет URL
// - Server читает URL и фетчит все репо параллельно
// - Client рендерит графики
//
// URL format: /compare?repos=owner1/repo1,owner2/repo2

type ComparePageProps = {
    searchParams: Promise<{
        repos?: string;
    }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const params = await searchParams;
    const reposParam = params.repos;

    // Parse repos from URL
    const repos = reposParam ? reposParam.split(',').filter(Boolean) : [];

    return (
        <div className="container mx-auto py-10">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center">
                        <ChartBarStacked  className="inline-block mr-2 w-12 h-12 text-purple-800 dark:text-purple-700" />
                        <span className='text-teal-600 dark:text-amber-300/80'>Compare Repositories</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Add repositories to compare them side-by-side
                    </p>
                    <p className="text-sm text-slate-600">
                        Format: [ <span className='text-teal-600 font-semibold'>owner</span> ]<span className='text-teal-600 font-semibold'> / </span>[ <span className='text-teal-600 font-semibold'>repository</span> ]
                    </p>
                </div>

                {/* Selector - Client Component */}
                <RepoSelector selectedRepos={repos} />

                {/* Comparison View */}
                {repos.length >= 2 ? (
                    <Suspense
                        key={reposParam}
                        fallback={<ComparisonSkeleton />}
                    >
                        <ComparisonView repos={repos} />
                    </Suspense>
                ) : (
                    <div className="rounded-lg border-2 border-dashed py-16 text-center">
                        <p className="text-muted-foreground text-lg">
                            Add at least 2 repositories to start comparison
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Use the search above to find repositories
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
