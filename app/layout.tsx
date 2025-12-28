import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Telescope } from 'lucide-react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider'; // ← Добавь
import { ThemeToggle } from '@/components/ThemeToggle'; // ← Добавь

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['GitHub', 'Repository', 'Analytics', 'Explorer'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur-md">
                            <div className="container mx-auto flex h-14 items-center justify-between">
                                {/* Navigation */}
                                <div className="flex gap-6">
                                    <Link
                                        href="/"
                                        className="flex items-center"
                                    >
                                        <Telescope className="mr-1 inline-block h-4 w-4" />
                                        <span className="font-bold text-teal-600">
                                            GitHub Explorer
                                        </span>
                                    </Link>
                                    <span>|</span>
                                    <Link href="/trending">
                                        <span className="text-foreground font-bold transition-all hover:text-teal-400 dark:hover:text-amber-300/80">
                                            TRENDING
                                        </span>
                                    </Link>
                                    <Link href="/compare">
                                        <span className="text-foreground font-semibold transition-all hover:text-teal-400 dark:hover:text-amber-300/80">
                                            COMPARE
                                        </span>
                                    </Link>
                                </div>

                                {/* Theme Toggle */}
                                <ThemeToggle />
                            </div>
                        </header>
                        <main className="flex-1 px-4">{children}</main>

                        <footer className="border-t px-4 py-6 md:py-0">
                            <div className="container mx-auto flex h-14 items-center justify-end">
                                <span className="text-muted-foreground text-xs text-stone-500 italic">
                                    by Alexey Ratnikov
                                </span>
                            </div>
                        </footer>
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
    );
}
