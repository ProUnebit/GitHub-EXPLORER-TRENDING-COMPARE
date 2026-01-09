'use client';

import { useState, useTransition } from 'react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { RatingStars } from './RatingStars';
import { FeedbackForm } from './FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, X, LoaderPinwheel } from 'lucide-react';
import { deleteFeedbackAction } from '@/app/actions';
import { toast } from 'sonner';
import type { Feedback } from '@/db/schema';
import { getGradientById } from '@/lib/utils/gradients';

type FeedbackCardProps = {
    feedback: Feedback;
    isOwner: boolean;
};

export function FeedbackCard({ feedback, isOwner }: FeedbackCardProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, startTransition] = useTransition();

    const gradient = getGradientById(feedback.id);

    async function handleDelete() {
        const confirmed = window.confirm('Are you sure you want to delete your feedback? This action cannot be undone.');

        if (!confirmed) return;

        setIsDeleting(true);

        startTransition(async () => {
            try {
                const result = await deleteFeedbackAction(feedback.id);

                if (result.success) {
                    toast.success('Feedback deleted successfully');
                } else {
                    toast.error(result.error);
                    setIsDeleting(false);
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete feedback');
                setIsDeleting(false);
            }
        });
    }

    function handleEditSuccess() {
        setIsEditing(false);
        toast.success('Feedback updated!');
    }

    if (isEditing) {
        return (
            <div className="space-y-4">
                {/* Close button */}
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="ml-auto ring ring-orange-500 hover:cursor-pointer"
                    >
                        <X className="mr-1 h-3 w-3 text-orange-500" />
                        Cancel
                    </Button>
                </div>

                {/* Edit form */}
                <FeedbackForm
                    mode="edit"
                    initialData={feedback}
                    onSuccess={handleEditSuccess}
                />
            </div>
        );
    }

    return (
        <Card
            id={`feedback-${feedback.id}`}
            className={`group relative overflow-hidden border-none bg-linear-to-br ${gradient} backdrop-blur-lg transition-all duration-300 ${isDeleting ? 'pointer-events-none opacity-50' : ''} `}
        >
            <div className="absolute inset-0 -z-10 bg-linear-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardContent className="relative z-10 p-6">
                {/* HEADER - Name, Rating, Date */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {/* Name + Edited badge */}
                        <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-teal-600">
                                {feedback.userName}
                            </h3>

                            {feedback.edited && (
                                <Badge variant="secondary" className="text-xs">
                                    edited
                                </Badge>
                            )}
                        </div>

                        {/* Rating stars */}
                        <RatingStars
                            value={feedback.rating}
                            readonly
                            size="sm"
                        />
                    </div>

                    {/* Date */}
                    <div className="text-muted-foreground text-sm">
                        {formatRelativeTime(feedback.createdAt.toISOString())}
                    </div>
                </div>

                {/* CONTENT - Feedback text */}
                <p className="mb-4 text-base leading-relaxed whitespace-pre-wrap">
                    {feedback.content}
                </p>

                {/* ACTIONS - Edit/Delete buttons */}
                {isOwner && (
                    <div className="flex gap-2 border-t border-white/10 pt-4">
                        {/* Edit button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            disabled={isPending}
                            className="cursor-pointer border-white/20 bg-white/5 hover:bg-white/50"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>

                        {/* Delete button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="text-destructive hover:text-destructive cursor-pointer border-white/20 bg-white/5 hover:bg-red-500/10"
                        >
                            {isPending && isDeleting ? (
                                <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
