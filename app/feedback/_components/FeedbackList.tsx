import { getUserId } from '@/lib/utils/user-session';
import * as feedbackQueries from '@/db/queries/feedback';
import { FeedbackCard } from './FeedbackCard';

export async function FeedbackList() {

    const [feedbacks, currentUserId] = await Promise.all([
        feedbackQueries.getAllFeedbacks(),
        getUserId(),
    ]);

    if (feedbacks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No feedback yet. Be the first to share your thoughts!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {feedbacks.map((feedback) => {

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
