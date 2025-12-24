'use client';

import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    return (
        <div className="container mx-auto py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 text-center">
                <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
                    <AlertCircle className="text-destructive h-10 w-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Comparison Failed</h1>
                    <p className="text-muted-foreground">
                        {error.message ||
                            'An error occurred while comparing repositories'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button onClick={reset}>Try Again</Button>
                    <Button asChild variant="outline">
                        <Link href="/compare">
                            <Home className="mr-2 h-4 w-4" />
                            Start Over
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
