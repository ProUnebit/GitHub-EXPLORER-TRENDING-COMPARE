import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Telescope } from 'lucide-react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollToTop } from '@/components/ScrollToTop';
import { MobileNav } from '@/components/MobileNav'; // ✅ Добавили
import { ViewTransitions, Link } from 'next-view-transitions';
import { ThemeOption } from '@/lib/constants/theme';
import { InitialLoader } from '@/components/InitialLoader';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    // variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        'GitHub',
        'Repository Explorer',
        'GitHub Analytics',
        'Trending Repositories',
        'Repository Comparison',
        'Open Source',
        'Developer Tools',
        'GitHub API',
        'Code Analysis',
        'Repository Statistics',
    ],
    authors: [{ name: 'Alexey Ratnikov' }],
    creator: 'Alexey Ratnikov',

    // App Meta
    applicationName: 'GitHub Explorer | Trending | Compare',
    category: 'Developer Tools',

    // URLs
    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'GitHub Explorer Dashboard',
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: ['/og-image.png'],
        creator: '@ProUnebit',
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    other: {
        // DNS prefetch для GitHub API
        'x-dns-prefetch-control': 'on',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    // themeColor: [
    //     { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    //     { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    // ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en" suppressHydrationWarning>
                <head>
                    {/* DNS Prefetch для GitHub API */}
                    <link rel="dns-prefetch" href="https://api.github.com" />
                    <link rel="preconnect" href="https://api.github.com" />

                    {/* Prefetch для avatars */}
                    <link
                        rel="dns-prefetch"
                        href="https://avatars.githubusercontent.com"
                    />
                </head>
                <body className={inter.className} suppressHydrationWarning>
                    <InitialLoader />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme={ThemeOption.DARK}
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="relative flex min-h-screen flex-col">
                            <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur-md">
                                <div className="container mx-auto flex h-14 items-center justify-between">
                                    {/* Mobile Navigation - только на мобильных */}
                                    <div className="flex items-center gap-3 md:hidden">
                                        <MobileNav />
                                        <Link href="/" className="flex items-center">
                                            <Telescope className="mr-1 h-4 w-4" />
                                            <span className="font-bold text-teal-600">
                                                GitHub Explorer
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Desktop Navigation - скрываем на мобильных */}
                                    <div className="hidden gap-4 md:flex lg:gap-6">
                                        <Link href="/" className="flex items-center">
                                            <Telescope className="mr-1 h-4 w-4" />
                                            <span className="font-bold text-teal-600">
                                                GitHub Explorer
                                            </span>
                                        </Link>
                                        <span className="text-muted-foreground">|</span>
                                        <Link href="/trending">
                                            <span className="font-semibold text-stone-600 transition-all hover:text-teal-400 dark:text-white dark:hover:text-amber-300/80">
                                                TRENDING
                                            </span>
                                        </Link>
                                        <Link href="/compare">
                                            <span className="font-semibold text-stone-600 transition-all hover:text-teal-400 dark:text-white dark:hover:text-amber-300/80">
                                                COMPARE
                                            </span>
                                        </Link>
                                        <span className="text-muted-foreground">|</span>
                                        <Link href="/feedback">
                                            <span className="font-semibold text-slate-500 transition-all hover:text-teal-400 dark:text-slate-400 dark:hover:text-amber-300/80">
                                                FEEDBACK
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Theme Toggle */}
                                    <ThemeToggle />
                                </div>
                            </header>

                            <main className="flex-1 px-4 sm:px-6 lg:px-8">{children}</main>

                            <footer className="border-t px-4 py-6 sm:px-6 lg:px-8 md:py-0">
                                <div className="container mx-auto flex h-auto md:h-10 items-center justify-center md:justify-end">
                                    <span className="text-xs text-stone-500/80">
                                        Copyright (c) 2026 Alexey Ratnikov
                                    </span>
                                </div>
                            </footer>

                            <ScrollToTop />
                        </div>

                        <Toaster
                            position="top-right"
                            expand={true}
                            richColors
                            duration={6000}
                        />
                    </ThemeProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
