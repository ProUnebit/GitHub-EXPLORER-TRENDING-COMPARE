import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

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
        <div className="relative min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-14 items-center">
              <div className="mr-4 flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <span className="font-bold">GitHub Explorer</span>
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex h-14 items-center justify-center text-sm text-muted-foreground">
              Built with Next.js & React Server Components
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}