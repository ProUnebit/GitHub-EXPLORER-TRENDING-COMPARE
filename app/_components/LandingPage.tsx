import { SearchInput } from '@/components/SearchInput';
import { FeatureCard } from './FeatureCard';

// ============================================
// LANDING PAGE COMPONENT
// ============================================
// Изолированный компонент для главной страницы
//
// Почему отдельный файл:
// - Четкая ответственность (landing content)
// - Можно легко изменить дизайн
// - Не загромождает page.tsx
// - Переиспользуемый (можно показать в других местах)

export function LandingPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col items-center justify-center space-y-8">
                {/* Hero Section */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        GitHub Explorer Dashboard
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Advanced GitHub repository explorer with analytics,
                        comparisons, and insights. Powered by React Server
                        Components.
                    </p>
                </div>

                {/* Search */}
                <SearchInput />

                {/* Features Grid */}
                <div className="mt-12 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        title="Repository Search"
                        description="Search millions of GitHub repositories with advanced filters"
                    />
                    <FeatureCard
                        title="Detailed Analytics"
                        description="View commits, contributors, languages, and activity trends"
                    />
                    <FeatureCard
                        title="Side-by-Side Comparison"
                        description="Compare multiple repositories to make informed decisions"
                    />
                    <FeatureCard
                        title="Trending Repos"
                        description="Discover what's trending in the open source community"
                    />
                    <FeatureCard
                        title="Export Data"
                        description="Export repository data to PDF or CSV for reporting"
                    />
                    <FeatureCard
                        title="Real-time Updates"
                        description="Server-side data fetching with smart caching strategies"
                    />
                </div>
            </div>
        </div>
    );
}
