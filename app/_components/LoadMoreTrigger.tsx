'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderPinwheel } from 'lucide-react';

// ============================================
// LOAD MORE TRIGGER - Client Component
// ============================================
// Intersection Observer для автоматической подгрузки
//
// Архитектура:
// - Невидимый div с ref как триггер
// - Intersection Observer следит за видимостью
// - Когда триггер виден → вызывает loadMore()
// - Fallback: кнопка "Load More" если JS отключен или ошибка
//
// UX:
// - Автоматическая подгрузка (плавный опыт)
// - Loading spinner во время загрузки
// - "No more results" когда всё загружено
// - Кнопка как fallback

type LoadMoreTriggerProps = {
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
};

export function LoadMoreTrigger({
    isLoading,
    hasMore,
    onLoadMore,
}: LoadMoreTriggerProps) {
    const observerTarget = useRef<HTMLDivElement>(null);

    // ============================================
    // INTERSECTION OBSERVER
    // ============================================
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Если триггер виден и можно загружать → загружаем
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoading
                ) {
                    onLoadMore();
                }
            },
            {
                threshold: 1.0, // Триггер полностью видим
                rootMargin: '300px', // Подгружаем за 300px до конца
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, isLoading, onLoadMore]);

    // ============================================
    // NO MORE RESULTS
    // ============================================
    if (!hasMore) {
        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                    All repositories loaded
                </p>
            </div>
        );
    }

    // ============================================
    // LOADING STATE
    // ============================================
    return (
        <div className="py-8">
            {/* Intersection Observer Target (невидимый) */}
            <div ref={observerTarget} className="h-px" />

            {/* Loading Indicator или Load More Button */}
            <div className="flex justify-center">
                {isLoading ? (
                    // Loading Spinner
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <LoaderPinwheel className="h-5 w-5 animate-spin text-teal-600" />
                        <span className="text-sm font-medium">Loading more repositories...</span>
                    </div>
                ) : (
                    // Fallback Button (на случай если Intersection Observer не сработал)
                    <Button
                        onClick={onLoadMore}
                        variant="outline"
                        size="lg"
                        disabled={!hasMore}
                    >
                        Load More
                    </Button>
                )}
            </div>
        </div>
    );
}
