'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

// ============================================
// THEME PROVIDER
// ============================================
// Wrapper для next-themes
// Управляет темой через localStorage и системные настройки

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
