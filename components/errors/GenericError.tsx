'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';

type GenericErrorProps = {
    title?: string;
    message?: string;
    statusCode?: number;
    technical?: string;
    onRetry?: () => void;
};

export function GenericError({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    statusCode,
    technical,
    onRetry,
}: GenericErrorProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="container mx-auto py-20">
            <Card className="max-w-2xl mx-auto border-red-500/50 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <div>
                            <CardTitle className="text-2xl">
                                {title}
                                {statusCode && (
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({statusCode})
                                    </span>
                                )}
                            </CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Technical Details */}
                    {technical && (
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showDetails ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                                Technical Details
                            </button>

                            {showDetails && (
                                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                                        {technical}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {onRetry && (
                            <Button onClick={onRetry} className="flex-1">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        )}
                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
