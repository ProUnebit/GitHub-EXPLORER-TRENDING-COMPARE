import { Suspense } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/app/_components/SearchResults';
import { LandingPage } from '@/app/_components/LandingPage';
import { SearchResultsSkeleton } from '@/app/_components/SearchResultsSkeleton';

type HomePageProps = {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        page?: string;
        language?: string; // ← Новый параметр
        minStars?: string; // ← Новый параметр
    }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
    const params = await searchParams;
    const query = params.q;

    // Нет query параметра → Landing Page
    if (!query) {
        return <LandingPage />;
    }

    // Есть query → Search Results
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-8">
                {/* Header с поиском */}
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-3xl font-bold">Search Results</h1>
                    <SearchInput />
                </div>

                {/* Результаты с Suspense */}
                <Suspense
                    key={query + params.language + params.minStars}
                    fallback={<SearchResultsSkeleton />}
                >
                    <SearchResults
                        query={query}
                        sort={params.sort}
                        language={params.language} // ← Передаём фильтр
                        minStars={params.minStars} // ← Передаём фильтр
                    />
                </Suspense>
            </div>
        </div>
    );
}
