'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

type ScrollToFeedbackButtonProps = {
    feedbackId: number;
};

export function ScrollToFeedbackButton({
    feedbackId,
}: ScrollToFeedbackButtonProps) {
    const handleScroll = () => {
        const element = document.getElementById(`feedback-${feedbackId}`);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });

            // Добавляем highlight эффект (опционально)
            element.classList.add('ring-3', 'ring-teal-400');

            setTimeout(() => {
                element.classList.remove('ring-3', 'ring-teal-400');
            }, 2000); // Убираем highlight через 2 секунды
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleScroll}
            className="ml-1 text-teal-600 hover:text-teal-600 dark:text-yellow-400 dark:hover:text-yellow-300 cursor-pointer"
        >
            <ArrowDown className="h-3 w-3" />
            Find
        </Button>
    );
}
