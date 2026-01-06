// app/feedback/_components/FeedbackForm.tsx

'use client';

import { useState, useTransition, useRef } from 'react'; // ← Добавили useRef
// import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { createFeedbackAction, updateFeedbackAction } from '@/app/actions';
import type { Feedback } from '@/db/schema';
import { LoaderPinwheel } from 'lucide-react';
import type { Rating } from '@/db/schema';

type FeedbackFormProps = {
    mode: 'create' | 'edit';
    initialData?: Feedback;
    onSuccess?: () => void;
};

export function FeedbackForm({
    mode,
    initialData,
    onSuccess,
}: FeedbackFormProps) {
    const [rating, setRating] = useState<Rating>(() => {
        if (!initialData?.rating) return 5;

        // Конвертируем string в number, затем в Rating
        const numericRating =
            typeof initialData.rating === 'string'
                ? parseFloat(initialData.rating)
                : initialData.rating;

        return numericRating as Rating;
    });

    const [isPending, startTransition] = useTransition();
    // const router = useRouter();

    // ✅ ДОБАВЛЯЕМ REF для формы
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.set('rating', rating.toString());

        // VALIDATION
        const userName = formData.get('userName') as string;
        const content = formData.get('content') as string;

        if (!userName || userName.trim().length === 0) {
            toast.error('Please enter your name');
            return;
        }

        if (!content || content.trim().length < 10) {
            toast.error('Feedback must be at least 10 characters');
            return;
        }

        // SUBMIT
        startTransition(async () => {
            try {
                let result;

                if (mode === 'create') {
                    result = await createFeedbackAction(formData);
                } else {
                    if (!initialData) {
                        toast.error('No feedback data to update');
                        return;
                    }
                    result = await updateFeedbackAction(
                        initialData.id,
                        formData
                    );
                }

                // HANDLE RESPONSE
                if (result.success) {
                    toast.success(
                        mode === 'create'
                            ? 'Thank you for your feedback!'
                            : 'Feedback updated successfully!'
                    );

                    // ✅ ИСПОЛЬЗУЕМ REF вместо event.currentTarget
                    if (mode === 'create') {
                        formRef.current?.reset();
                        setRating(5);
                    }

                    onSuccess?.();
                } else {
                    toast.error(result.error);
                }
            } catch (error) {
                console.error('Form submit error:', error);
                toast.error('Something went wrong. Please try again.');
            }
        });
    }

    return (
        <Card className='bg-card dark:border-teal-900/60'>
            <CardHeader>
                <CardTitle>
                    {mode === 'create'
                        ? 'Share Your Feedback'
                        : 'Edit Your Feedback'}
                </CardTitle>
                <CardDescription>
                    {mode === 'create'
                        ? 'We value your opinion! Let us know what you think about this project.'
                        : 'Update your feedback and rating.'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* ✅ ДОБАВЛЯЕМ ref={formRef} */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* NAME INPUT */}
                    <div className="space-y-2">
                        <Label htmlFor="userName">Your Name *</Label>
                        <Input
                            id="userName"
                            name="userName"
                            placeholder="John Doe"
                            defaultValue={initialData?.userName ?? ''}
                            required
                            disabled={isPending}
                            className="font-semibold text-teal-600 transition-opacity disabled:opacity-50"
                        />
                    </div>

                    {/* RATING STARS */}
                    <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        {/* ✅ ДОБАВЛЯЕМ allowHalf={true} */}
                        <RatingStars
                            value={rating}
                            onChange={setRating}
                            size="lg"
                            showNumber
                            allowHalf={true} // ← Разрешаем выбор половинок
                        />
                        <p className="text-muted-foreground text-xs">
                            Click left half for .5 ratings (e.g., 3.5, 4.5)
                        </p>
                    </div>

                    {/* FEEDBACK TEXTAREA */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Your Feedback *</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Tell us what you think..."
                            rows={5}
                            defaultValue={initialData?.content ?? ''}
                            required
                            minLength={10}
                            disabled={isPending}
                            className="resize-none transition-opacity disabled:opacity-50"
                        />
                        <p className="text-muted-foreground text-xs">
                            Minimum 10 characters
                        </p>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="text-right">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 cursor-pointer bg-stone-600 text-lg dark:bg-amber-300/80 dark:hover:bg-amber-300/90"
                        >
                            {isPending && (
                                <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin text-teal-700" />
                            )}
                            {mode === 'create'
                                ? 'Submit Feedback'
                                : 'Update Feedback'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
