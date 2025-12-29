import { getRepository, getLanguages, getContributors } from '@/lib/github/api';
import { ComparisonExportWrapper } from './ComparisonExportWrapper';

type ComparisonViewProps = {
    repos: string[];
};

type RepoData = {
    fullName: string;
    owner: string;
    name: string;
    repo: Awaited<ReturnType<typeof getRepository>>;
    languages: Awaited<ReturnType<typeof getLanguages>>;
    contributors: Awaited<ReturnType<typeof getContributors>>;
};

export async function ComparisonView({ repos }: ComparisonViewProps) {
    const reposData = await Promise.all(
        repos.map(async (fullName) => {
            try {
                const [owner, name] = fullName.split('/');

                const [repo, languages, contributors] = await Promise.all([
                    getRepository(owner, name),
                    getLanguages(owner, name),
                    getContributors(owner, name, 100),
                ]);

                return {
                    fullName,
                    owner,
                    name,
                    repo,
                    languages,
                    contributors,
                } as RepoData;
            } catch (error) {
                console.error(`Failed to fetch ${fullName}:`, error);
                return null;
            }
        })
    );

    const validRepos = reposData.filter((r): r is RepoData => r !== null);

    if (validRepos.length === 0) {
        return (
            <div className="rounded-lg border py-12 text-center">
                <p className="text-destructive text-lg">
                    Failed to load repositories
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Check repository names and try again
                </p>
            </div>
        );
    }

    if (validRepos.length < repos.length) {
        const failed = repos.filter(
            (r) => !validRepos.find((v) => v.fullName === r)
        );

        return (
            <div className="space-y-6">
                <div className="bg-destructive/10 border-destructive/40 rounded-lg border p-4">
                    <p className="text-destructive text-sm">
                        Failed to load: {failed.join(', ')}
                    </p>
                </div>

                {validRepos.length >= 2 && (
                    <ComparisonExportWrapper repos={validRepos} />
                )}
            </div>
        );
    }

    // Все репо загружены успешно - используем wrapper
    return <ComparisonExportWrapper repos={validRepos} />;
}
