// components/errors/RateLimitError.tsx

/**
 * ============================================
 * RATE LIMIT ERROR UI
 * ============================================
 * 
 * Показывается когда превышен лимит GitHub API (403)
 * 
 * Features:
 * - Countdown timer до reset
 * - Советы по получению токена
 * - Retry button
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Key, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RateLimitErrorProps = {
    resetAt?: Date;
    onRetry?: () => void;
};

export function RateLimitError({ resetAt, onRetry }: RateLimitErrorProps) {
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    useEffect(() => {
        if (!resetAt) return;

        const updateCountdown = () => {
            const now = Date.now();
            const reset = resetAt.getTime();
            const seconds = Math.max(0, Math.floor((reset - now) / 1000));
            setSecondsLeft(seconds);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [resetAt]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto py-20">
            <Card className="max-w-2xl mx-auto border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                        <div>
                            <CardTitle className="text-2xl">Rate Limit Exceeded</CardTitle>
                            <CardDescription>
                                GitHub API rate limit reached
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Countdown */}
                    {resetAt && secondsLeft > 0 && (
                        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                            <Clock className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="font-medium">Limit resets in:</p>
                                <p className="text-2xl font-bold text-amber-500">
                                    {formatTime(secondsLeft)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            GitHub API has rate limits to ensure fair usage:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li><strong>Without token:</strong> 60 requests per hour</li>
                            <li><strong>With token:</strong> 5,000 requests per hour</li>
                        </ul>
                    </div>

                    {/* Get Token CTA */}
                    <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-500/50">
                        <Key className="h-5 w-5 text-teal-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-sm mb-2">Get Higher Limits</p>
                            <p className="text-xs text-muted-foreground mb-3">
                                Add a GitHub Personal Access Token to increase your rate limit to 5,000 requests/hour.
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                asChild
                            >
                                <a
                                    href="https://github.com/settings/tokens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Create Token
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Retry Button */}
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            className="w-full"
                            disabled={secondsLeft > 0}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {secondsLeft > 0 ? 'Please wait...' : 'Try Again'}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
