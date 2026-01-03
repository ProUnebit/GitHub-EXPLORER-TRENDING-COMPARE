import { SearchInput } from '@/components/SearchInput';
import { FeatureCardList } from './FeatureCardList';
import { Telescope } from 'lucide-react';

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
                    <h1 className="flex items-center justify-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        <Telescope className="mr-2 inline-block h-14 w-14" />
                        <span className="text-teal-600">GitHub Explorer</span>
                        &nbsp;
                        <span className="text-stone-600 dark:text-stone-300">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Advanced GitHub repository explorer with trendings,
                        analytics, comparisons, and insights.
                    </p>
                </div>
                {/* Search */}
                <SearchInput />
                {/* Features Grid */}
                <FeatureCardList />
            </div>
        </div>
    );
}
