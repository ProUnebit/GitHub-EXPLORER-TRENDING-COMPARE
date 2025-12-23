'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, X, Check } from 'lucide-react';

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

type TrendingFiltersProps = {
    currentSince: 'daily' | 'weekly' | 'monthly';
    currentLanguage?: string;
};

const POPULAR_LANGUAGES = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C',
    'C++',
    'C#',
    'PHP',
    'Ruby',
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
                            since: value as 'daily' | 'weekly' | 'monthly',
                        })
                    }
                >
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger
                            value="daily"
                            disabled={isPending}
                            className="data-[state=active]:ring-2 ring-teal-400 text-md hover:cursor-pointer"
                        >
                            Today
                        </TabsTrigger>
                        <TabsTrigger
                            value="weekly"
                            disabled={isPending}
                            className="data-[state=active]:ring-2 ring-teal-400 text-md hover:cursor-pointer"
                        >
                            This Week
                        </TabsTrigger>
                        <TabsTrigger
                            value="monthly"
                            disabled={isPending}
                            className="data-[state=active]:ring-2 ring-teal-400 text-md hover:cursor-pointer"
                        >
                            This Month
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
                            className="hover:cursor-pointer"
                        >
                            <X className="mr-1 h-3 w-3" />
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {POPULAR_LANGUAGES.map((language) => {
                        const isActive =
                            currentLanguage?.toLowerCase() ===
                            language.toLowerCase();
                        const isLoading =
                            isPending &&
                            pendingLanguage?.toLowerCase() ===
                                language.toLowerCase();

                        return (
                            <Button
                                key={language}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateFilters({ language })}
                                disabled={isPending}
                                className={
                                    isActive
                                        ? 'ring-2 ring-teal-400 hover:cursor-default transition-all'
                                        : 'ring-2 ring-neutral-100 hover:cursor-pointer transition-all'
                                }
                            >
                                {/* Icon слева */}
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                ) : isActive ? (
                                    <Check className="mr-2 h-3 w-3 text-teal-500" />
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
