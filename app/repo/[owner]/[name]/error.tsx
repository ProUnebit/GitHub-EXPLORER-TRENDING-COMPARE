'use client';

import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================
// ERROR BOUNDARY - для repo route
// ============================================
// Ловит все ошибки в этом route и ниже
//
// Типичные ошибки которые ловим:
// - Repository not found (404)
// - Rate limit exceeded (403)
// - Network errors
// - Ошибки в компонентах
//
// UX решение:
// - Понятное сообщение об ошибке
// - Кнопки для восстановления (Try again, Go home)
// - Dev mode: показываем stack trace

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    // Проверяем тип ошибки
    const is404 =
        error.message.includes('404') || error.message.includes('Not Found');
    const isRateLimit =
        error.message.includes('rate limit') || error.message.includes('403');

    return (
        <div className="container mx-auto py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 text-center">
                {/* Icon */}
                <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
                    <AlertCircle className="text-destructive h-10 w-10" />
                </div>

                {/* Title & Message */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">
                        {is404
                            ? 'Repository Not Found'
                            : 'Something Went Wrong'}
                    </h1>
                    <p className="text-muted-foreground">
                        {is404
                            ? 'The repository you are looking for does not exist or is private.'
                            : isRateLimit
                              ? 'GitHub API rate limit exceeded. Please try again later or add a GitHub token to your .env.local file.'
                              : error.message ||
                                'An unexpected error occurred while loading the repository.'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={reset} variant="default">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Dev mode: Stack trace */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-8 w-full text-left">
                        <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
                            Error details (development only)
                        </summary>
                        <pre className="bg-muted mt-4 max-h-96 overflow-auto rounded p-4 text-xs">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
