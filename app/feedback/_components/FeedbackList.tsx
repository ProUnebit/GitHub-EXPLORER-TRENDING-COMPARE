// app/feedback/_components/FeedbackList.tsx

/**
 * ============================================
 * FEEDBACK LIST COMPONENT
 * ============================================
 *
 * Server Component для показа списка всех отзывов
 *
 * Ответственности:
 * - Fetch всех отзывов из БД
 * - Определение владельца (isOwner) для каждого отзыва
 * - Рендер FeedbackCard для каждого отзыва
 */

import { getUserId } from '@/lib/utils/user-session';
import * as feedbackQueries from '@/db/queries/feedback';
import { FeedbackCard } from './FeedbackCard';

// ============================================
// COMPONENT
// ============================================
export async function FeedbackList() {
    // ============================================
    // FETCH DATA
    // ============================================
    // Параллельно получаем отзывы и userId текущего пользователя
    const [feedbacks, currentUserId] = await Promise.all([
        feedbackQueries.getAllFeedbacks(),
        getUserId(),
    ]);

    // ============================================
    // EMPTY STATE
    // ============================================
    if (feedbacks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No feedback yet. Be the first to share your thoughts!
                </p>
            </div>
        );
    }

    // ============================================
    // RENDER LIST
    // ============================================
    return (
        <div className="space-y-6">
            {feedbacks.map((feedback) => {
                // Проверяем: это отзыв текущего пользователя?
                const isOwner = feedback.userId === currentUserId;

                return (
                    <FeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        isOwner={isOwner}
                    />
                );
            })}
        </div>
    );
}
