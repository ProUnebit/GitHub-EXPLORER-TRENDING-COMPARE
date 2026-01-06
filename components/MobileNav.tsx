// components/MobileNav.tsx

'use client';

/**
 * ============================================
 * MOBILE NAVIGATION
 * ============================================
 *
 * Адаптивное мобильное меню с бургером
 *
 * Responsive breakpoints:
 * - Mobile: < 768px (показываем бургер)
 * - Desktop: >= 768px (показываем полное меню)
 */

import { useState } from 'react';
import {
    Menu,
    X,
    Telescope,
    MessageSquare,
    TrendingUp,
    GitCompare,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export function MobileNav() {
    const [open, setOpen] = useState(false);

    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: <Telescope className="h-5 w-5" />,
        },
        {
            href: '/trending',
            label: 'Trending',
            icon: <TrendingUp className="h-5 w-5" />,
        },
        {
            href: '/compare',
            label: 'Compare',
            icon: <GitCompare className="h-5 w-5" />,
        },
        {
            href: '/feedback',
            label: 'Feedback',
            icon: <MessageSquare className="h-5 w-5" />,
        },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-teal-600">
                        MENU
                    </SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:text-teal-600 dark:hover:text-amber-300"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
