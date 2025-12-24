import { getRepository, getLanguages, getContributors } from '@/lib/github/api';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonCharts } from './ComparisonCharts';

// ============================================
// COMPARISON VIEW - Server Component
// ============================================
// Фетчит данные всех репозиториев ПАРАЛЛЕЛЬНО
// Передает данные в таблицу и графики
//
// RSC паттерн: Parallel Data Fetching
// - Promise.all для параллельных запросов
// - Server фетчит → Client рендерит визуализацию
//
// Performance:
// Sequential: 300ms * 4 repos = 1200ms
// Parallel: max(300ms) = 300ms

type ComparisonViewProps = {
    repos: string[];
};

// Тип для полных данных репо с дополнительной инфой
type RepoData = {
    fullName: string;
    owner: string;
    name: string;
    repo: Awaited<ReturnType<typeof getRepository>>;
    languages: Awaited<ReturnType<typeof getLanguages>>;
    contributors: Awaited<ReturnType<typeof getContributors>>;
};

export async function ComparisonView({ repos }: ComparisonViewProps) {
    // ============================================
    // PARALLEL DATA FETCHING
    // ============================================
    // Фетчим все репо одновременно
    // Если один упал - остальные продолжают грузиться

    const reposData = await Promise.all(
        repos.map(async (fullName) => {
            try {
                const [owner, name] = fullName.split('/');

                // Параллельные запросы для каждого репо
                const [repo, languages, contributors] = await Promise.all([
                    getRepository(owner, name),
                    getLanguages(owner, name),
                    getContributors(owner, name, 100), // Топ 100 для точного count
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
                // Если репо не найден - возвращаем null
                console.error(`Failed to fetch ${fullName}:`, error);
                return null;
            }
        })
    );

    // Фильтруем успешные загрузки
    const validRepos = reposData.filter((r): r is RepoData => r !== null);

    // Если ни одно репо не загрузилось
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

    // Если загрузились не все
    if (validRepos.length < repos.length) {
        const failed = repos.filter(
            (r) => !validRepos.find((v) => v.fullName === r)
        );

        return (
            <div className="space-y-6">
                <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
                    <p className="text-destructive text-sm">
                        Failed to load: {failed.join(', ')}
                    </p>
                </div>

                {validRepos.length >= 2 && (
                    <>
                        <ComparisonTable repos={validRepos} />
                        <ComparisonCharts repos={validRepos} />
                    </>
                )}
            </div>
        );
    }

    // Все репо загружены успешно
    return (
        <div className="space-y-8">
            <ComparisonTable repos={validRepos} />
            <ComparisonCharts repos={validRepos} />
        </div>
    );
}
