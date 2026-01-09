'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, LoaderPinwheel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/app/_components/SearchFilters';
import { toast } from 'sonner';

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [language, setLanguage] = useState(
        searchParams.get('language') || ''
    );
    const [minStars, setMinStars] = useState(
        searchParams.get('minStars') || ''
    );

    const [isPending, startTransition] = useTransition();

    const handleClearFilters = () => {
        setLanguage('');
        setMinStars('');

        // Если есть активный поиск - перезапускаем без фильтров
        if (query.trim()) {
            const params = new URLSearchParams();
            params.set('q', query.trim());

            startTransition(() => {
                router.push(`/?${params.toString()}`);
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            toast.warning('Enter search query');
            return;
        }

        // Build URL with filters
        const params = new URLSearchParams();
        params.set('q', query.trim());

        if (language && language !== 'all') {
            params.set('language', language);
        }
        if (minStars) {
            params.set('minStars', minStars);
        }

        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
            {/* Search Input */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Search repositories... (e.g., react, vue, nextjs)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 font-semibold text-teal-600"
                        disabled={isPending}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!query.trim() || isPending}
                    className="bg-stone-600 cursor-pointer dark:bg-amber-300/80"
                >
                    {isPending ? (
                        <>
                            <LoaderPinwheel className="mr-1 h-4 w-4 animate-spin text-teal-700" />
                            Searching...
                        </>
                    ) : (
                        'Search'
                    )}
                </Button>
            </div>

            {/* Filters with Clear Button */}
            <SearchFilters
                language={language}
                minStars={minStars}
                onLanguageChange={setLanguage}
                onMinStarsChange={setMinStars}
                onClearFilters={handleClearFilters}
                disabled={isPending}
            />
        </form>
    );
}
