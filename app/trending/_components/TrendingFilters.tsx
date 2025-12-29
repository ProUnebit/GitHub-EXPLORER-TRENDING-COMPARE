'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoaderPinwheel, X, Check } from 'lucide-react';
import { getLanguageColor } from '@/lib/constants/language-colors';

// ============================================
// TRENDING FILTERS - Client Component
// ============================================
// Управляет URL через router.push
// Использует useTransition для loading state
//
// Улучшения:
// - Локальный state для отслеживания кликнутой кнопки
// - Лоудер показывается на НОВОЙ кнопке (не старой)
// - Более очевидная визуализация активного состояния

type Since = 'daily' | 'weekly' | 'monthly' | 'year';

type TrendingFiltersProps = {
    currentSince: Since;
    currentLanguage?: string;
};

const POPULAR_LANGUAGES = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Go',
    'Java',
    'Rust',
    'Zig',
    'R',
    'C',
    'C++',
    'C#',
    'F#',
    'PHP',
    'Ruby',
    'Dart',
    'Swift',
    'WebAssembly',
    'Kotlin',
    'Scala',
    'Haskell',
    'Lua',
    'Elixir',
    'Erlang',
    'Perl',
    'Shell'
];

export function TrendingFilters({
    currentSince,
    currentLanguage,
}: TrendingFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // ============================================
    // LOCAL STATE - отслеживаем какую кнопку кликнули
    // ============================================
    // Это решает проблему с лоудером на старой кнопке
    const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

    const updateFilters = (updates: {
        since?: string;
        language?: string | null;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (updates.since) {
            params.set('since', updates.since);
        }

        if (updates.language === null) {
            params.delete('language');
            setPendingLanguage(null);
        } else if (updates.language) {
            params.set('language', updates.language.toLowerCase());
            // Запоминаем какую кнопку кликнули
            setPendingLanguage(updates.language);
        }

        startTransition(() => {
            router.push(`/trending?${params.toString()}`);
        });
    };

    return (
        <div className="space-y-6">
            {/* ============================================
          TIME RANGE SELECTOR
          ============================================ */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Tabs
                    value={currentSince}
                    onValueChange={(value) =>
                        updateFilters({
                            since: value as Since,
                        })
                    }
                >
                    <TabsList className="grid w-full max-w-lg grid-cols-4  ">
                        <TabsTrigger
                            value="daily"
                            disabled={isPending}
                            className="dark:data-[state=active]:bg-accent/80 data-[state=active]:ring-2 ring-teal-400 text-md cursor-pointer"
                        >
                            Today
                        </TabsTrigger>
                        <TabsTrigger
                            value="weekly"
                            disabled={isPending}
                            className="dark:data-[state=active]:bg-accent/80 data-[state=active]:ring-2 ring-teal-400 text-md cursor-pointer"
                        >
                            This Week
                        </TabsTrigger>
                        <TabsTrigger
                            value="monthly"
                            disabled={isPending}
                            className="dark:data-[state=active]:bg-accent/80 data-[state=active]:ring-2 ring-teal-400 text-md cursor-pointer"
                        >
                            This Month
                        </TabsTrigger>
                        <TabsTrigger
                            value="year"
                            disabled={isPending}
                            className="dark:data-[state=active]:bg-accent/80 data-[state=active]:ring-2 ring-teal-400 text-md cursor-pointer"
                        >
                            This Year
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* ============================================
          LANGUAGE FILTER
          ============================================ */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Language</label>
                    {currentLanguage && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateFilters({ language: null })}
                            disabled={isPending}
                            className="hover:cursor-pointer ring ring-orange-500"
                        >
                            <X className="mr-1 h-3 w-3 text-orange-500" />
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 max-w-7xl">
                    {POPULAR_LANGUAGES.map((language) => {
                        const isActive =
                            currentLanguage?.toLowerCase() ===
                            language.toLowerCase();
                        const isLoading =
                            isPending &&
                            pendingLanguage?.toLowerCase() ===
                                language.toLowerCase();
                        // const colorLanguage = getLanguageColor(language);
                        const backgroundColorLanguage = `rgb(from ${getLanguageColor(language)} r g b / 0.25)`;

                        return (
                            <Button
                                key={language}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateFilters({ language })}
                                disabled={isPending}
                                className={
                                    isActive
                                        ? 'ring-2 ring-teal-400 hover:cursor-default transition-all bg-accent/90!  text-primary hover:bg-accent/80'
                                        : 'ring-2 ring-neutral-300 hover:cursor-pointer transition-all'
                                }
                                style={{ backgroundColor: backgroundColorLanguage }}
                            >
                                {/* Icon слева */}
                                {isLoading ? (
                                    <LoaderPinwheel className="mr-2 h-3 w-3 animate-spin text-teal-600 dark:text-amber-300/80" />
                                ) : isActive ? (
                                    <Check className="mr-2 h-3 w-3 text-teal-300" />
                                ) : null}
                                {language}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
