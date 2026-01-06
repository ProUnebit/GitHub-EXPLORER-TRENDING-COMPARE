// app/feedback/page.tsx

/**
 * ============================================
 * FEEDBACK PAGE
 * ============================================
 *
 * Главная страница для системы отзывов
 *
 * Структура:
 * 1. Header + описание
 * 2. FeedbackStats (средний рейтинг)
 * 3. FeedbackForm (если у пользователя нет отзыва) или сообщение
 * 4. FeedbackList (все отзывы)
 *
 * SEO:
 * - Server Component для статических данных
 * - Metadata для поисковиков
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUserId } from '@/lib/utils/user-session';
import * as feedbackQueries from '@/db/queries/feedback';
import { FeedbackStats } from './_components/FeedbackStats';
import { FeedbackList } from './_components/FeedbackList';
import { FeedbackForm } from './_components/FeedbackForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare, MessageSquareMore, Star } from 'lucide-react';
import { ScrollToFeedbackButton } from './_components/ScrollToFeedbackButton';

// ============================================
// METADATA
// ============================================
export const metadata: Metadata = {
    title: 'Feedback',
    description:
        'Share your feedback and help us improve GitHub Explorer Dashboard',
};

// ============================================
// LOADING COMPONENTS
// ============================================
function StatsLoading() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-6">
                    <Skeleton className="h-20 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ListLoading() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ============================================
// CHECK USER FEEDBACK COMPONENT
// ============================================
// Проверяем есть ли у пользователя отзыв
async function UserFeedbackSection() {
    const userId = await getUserId();
    const userFeedback = await feedbackQueries.getUserFeedback(userId);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-amber-300/80">
                    <MessageSquareMore className="h-5 w-5 text-teal-500" />
                    Your Feedback
                </CardTitle>
            </CardHeader>
            <CardContent>
                {userFeedback ? (
                    // У пользователя уже есть отзыв
                    <div className="bg-secondary/50 flex items-center gap-3 rounded-lg p-4">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div className="flex-1">
                            <p className="font-medium">
                                You&apos;ve already shared your feedback!
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-sm">
                                    You can find and edit it in the list below.
                                </p>
                                <ScrollToFeedbackButton feedbackId={userFeedback.id} />
                            </div>
                        </div>
                    </div>
                ) : (
                    // У пользователя нет отзыва - показываем форму
                    <FeedbackForm mode="create" />
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function FeedbackPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* ============================================ */}
                {/* HEADER */}
                {/* ============================================ */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        <MessagesSquare className="inline-block mr-3 w-12 h-12 text-emerald-600" />
                        <span className='text-teal-600 dark:text-amber-300/80'>Feedback & Reviews</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Share your experience with GitHub Explorer | Trending | Compare.
                         <br /> Your feedback helps us improve!
                    </p>
                </div>

                {/* ============================================ */}
                {/* STATS - Средний рейтинг и статистика */}
                {/* ============================================ */}
                <Suspense fallback={<StatsLoading />}>
                    <FeedbackStats />
                </Suspense>

                {/* ============================================ */}
                {/* USER FEEDBACK SECTION */}
                {/* Форма или сообщение "уже есть отзыв" */}
                {/* ============================================ */}
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <UserFeedbackSection />
                </Suspense>

                {/* ============================================ */}
                {/* DIVIDER */}
                {/* ============================================ */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-stone-400" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-2">
                            All Reviews
                        </span>
                    </div>
                </div>

                {/* ============================================ */}
                {/* FEEDBACK LIST - Все отзывы */}
                {/* ============================================ */}
                <Suspense fallback={<ListLoading />}>
                    <FeedbackList />
                </Suspense>
            </div>
        </div>
    );
}
