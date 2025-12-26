'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, LoaderPinwheel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ============================================
// SEARCH INPUT - Client Component
// ============================================
// Добавляем useTransition для loading state
// Показываем spinner пока идет навигация

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Инициализируем с текущим query (если есть)
    const [query, setQuery] = useState(searchParams.get('q') || '');

    // useTransition - отслеживает pending навигацию
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            toast.warning('Enter search query');
            return;
        }

        // if (query.trim()) {
        // Оборачиваем навигацию в transition
        startTransition(() => {
            router.push(`/?q=${encodeURIComponent(query.trim())}`);
        });
        // }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-2xl items-center gap-2"
        >
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    autoFocus
                    type="text"
                    placeholder="Search repositories... (e.g., react, vue, nextjs)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 font-semibold text-teal-600"
                    disabled={isPending} // Отключаем пока грузится
                />
            </div>

            <Button
                type="submit"
                disabled={!query.trim() || isPending}
                className="hover:cursor-pointer"
            >
                {/* Показываем spinner или иконку */}
                {isPending ? (
                    <>
                        <LoaderPinwheel className="mr-1 h-4 w-4 animate-spin text-teal-600" />
                        Searching...
                    </>
                ) : (
                    'Search'
                )}
            </Button>
        </form>
    );
}
