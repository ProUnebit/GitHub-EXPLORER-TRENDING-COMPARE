'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderPinwheel } from 'lucide-react';

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

    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoading
                ) {
                    onLoadMore();
                }
            },
            {
                threshold: 1.0,
                rootMargin: '300px',
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, isLoading, onLoadMore]);

    if (!hasMore) {
        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                    All repositories loaded
                </p>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div ref={observerTarget} className="h-px" />

            <div className="flex justify-center">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <LoaderPinwheel className="h-5 w-5 animate-spin text-teal-600" />
                        <span className="text-sm font-medium">Loading more repositories...</span>
                    </div>
                ) : (
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
