'use client';

import { Moon, Sun, MonitorCog, LoaderPinwheel } from 'lucide-react';
import { useTheme } from 'next-themes';
import { JSX, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================
// THEME TOGGLE - Client Component
// ============================================
// Кнопка переключения темы
// Показывает текущую тему и позволяет выбрать light/dark/system

enum ThemeOption {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system'
}

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const THEME_ICONS: Record<ThemeOption, JSX.Element> = {
        [ThemeOption.LIGHT]: <Sun className="h-7 w-7 text-teal-600 dark:text-amber-300/80" />,
        [ThemeOption.DARK]: <Moon className="h-7 w-7 text-teal-600 dark:text-amber-300/80" />,
        [ThemeOption.SYSTEM]: <MonitorCog className="h-7 w-7 text-teal-600 dark:text-amber-300/80" />,
    };

    const getCurrentThemeIcon = (theme: string | undefined): JSX.Element => theme 
            ? THEME_ICONS[theme as ThemeOption] 
            : THEME_ICONS[ThemeOption.SYSTEM];


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return <LoaderPinwheel className="h-7 w-7 animate-spin text-teal-600" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
                {getCurrentThemeIcon(theme)}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-slate-50 dark:bg-stone-950 text-stone-700 dark:text-white'>
                <DropdownMenuItem onClick={() => setTheme(ThemeOption.LIGHT)} className='cursor-pointer hover:bg-teal-100'>
                    <Sun className="mr-2 h-4 w-4 text-teal-600 dark:text-amber-300/80" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(ThemeOption.DARK)} className='cursor-pointer hover:bg-teal-100'>
                    <Moon className="mr-2 h-4 w-4 text-teal-600 dark:text-amber-300/80" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(ThemeOption.SYSTEM)} className='cursor-pointer hover:bg-teal-100'>
                    <MonitorCog className="mr-2 h-4 w-4 text-teal-600 dark:text-amber-300/80" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
