'use client';

import { useState, useEffect } from 'react';
import { ArrowBigUpDash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Button
            size="icon"
            onClick={scrollToTop}
            className={cn(
                'bg-teal-500 hover:bg-teal-500 dark:bg-amber-300/80 h-10 w-10 cursor-pointer fixed right-6 bottom-6 z-50 rounded-full shadow-md transition-all duration-450 hover:scale-110',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-12 opacity-0'
            )}
            aria-label="Scroll to top"
        >
            <ArrowBigUpDash className="h-5 w-5" />
        </Button>
    );
}
