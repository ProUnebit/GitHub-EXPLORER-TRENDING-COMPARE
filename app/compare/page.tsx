import { Suspense } from 'react';
import { RepoSelector } from './_components/RepoSelector';
import { ComparisonView } from './_components/ComparisonView';
import { ComparisonSkeleton } from './_components/ComparisonSkeleton';
import { ChartBarStacked  } from 'lucide-react'

export const metadata = {
    title: 'Compare Repositories - GitHub Explorer',
    description: 'Compare multiple GitHub repositories side-by-side',
};

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
        <div className="container mx-auto py-6 sm:py-10">
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="space-y-2 px-4 sm:px-0">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <ChartBarStacked  className="w-10 h-10 sm:w-12 sm:h-12 text-purple-800 dark:text-purple-700" />
                        <span className='text-teal-600 dark:text-amber-300/80'>Compare Repositories</span>
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Add repositories to compare them side-by-side
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">
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
                    <div className="rounded-lg border-2 border-dashed py-12 sm:py-16 text-center mx-4 sm:mx-0">
                        <p className="text-muted-foreground text-base sm:text-lg px-4">
                            Add at least 2 repositories or more to start comparison
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm px-4">
                            Use the search above to find repositories
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
