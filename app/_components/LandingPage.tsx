import { Suspense } from 'react'; // ← Добавить import
import { SearchInput } from '@/components/SearchInput';
import { FeatureCardList } from './FeatureCardList';
import { QuickStats } from './QuickStats'; // ← Добавить
import { QuickStatsLoading } from './QuickStatsLoading'; // ← Добавить
import { Telescope } from 'lucide-react';
// import { Logo } from '@/components/Logo';

export function LandingPage() {
    return (
        <div className="container mx-auto py-6 sm:py-10">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
                {/* Hero Section */}
                <div className="space-y-3 sm:space-y-4 text-center px-4">
                    <h1 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        <Telescope className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 sm:mr-2" />
                        {/* <Logo className="mr-1 h-15 w-15" /> */}
                        <span className="text-teal-600">
                            GitHub Explorer
                        </span>
                        <span className="hidden sm:inline">&nbsp;</span>
                        <span className="text-stone-600 dark:text-stone-300">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-muted-foreground max-w-4xl text-base sm:text-lg px-4">
                        Advanced GitHub repository explorer with trendings,
                        analytics, comparisons and insights.
                    </p>
                </div>

                <SearchInput />

                <Suspense fallback={<QuickStatsLoading />}>
                    <QuickStats />
                </Suspense>

                <FeatureCardList />
            </div>
        </div>
    );
}
