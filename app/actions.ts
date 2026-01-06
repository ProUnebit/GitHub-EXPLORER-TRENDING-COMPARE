// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getOrCreateUserId } from '@/lib/utils/user-session'; // ← Изменено
import * as feedbackQueries from '@/db/queries/feedback';
import type { Feedback } from '@/db/schema';
import type { Rating } from '@/db/schema';

type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// CREATE FEEDBACK ACTION
// ============================================
export async function createFeedbackAction(
  formData: FormData
): Promise<ActionResponse<Feedback>> {
  try {
    const userId = await getOrCreateUserId();
    const existingFeedback = await feedbackQueries.getUserFeedback(userId);
    
    if (existingFeedback) {
      return {
        success: false,
        error: 'You already have a feedback. Please edit your existing one.',
      };
    }
    
    const userName = formData.get('userName') as string;
    const content = formData.get('content') as string;
    const ratingStr = formData.get('rating') as string;
    
    if (!userName || userName.trim().length === 0) {
      return { success: false, error: 'Name is required' };
    }
    
    if (!content || content.trim().length < 10) {
      return { success: false, error: 'Feedback must be at least 10 characters' };
    }
    
    // ✅ ОБНОВЛЯЕМ валидацию для половинок
    const rating = parseFloat(ratingStr);
    if (isNaN(rating) || rating < 0.5 || rating > 5) {
      return { success: false, error: 'Rating must be between 0.5 and 5' };
    }
    
    // Проверяем что это валидный rating (1, 1.5, 2, 2.5, ...)
    const validRatings: Rating[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    if (!validRatings.includes(rating as Rating)) {
      return { success: false, error: 'Invalid rating value' };
    }
    
    const newFeedback = await feedbackQueries.createFeedback({
      userId,
      userName: userName.trim(),
      content: content.trim(),
      rating: rating.toString(), // Drizzle принимает string для NUMERIC
    });
    
    revalidatePath('/');
    revalidatePath('/feedback');
    
    return {
      success: true,
      data: newFeedback,
    };
    
  } catch (error) {
    console.error('Create feedback error:', error);
    return {
      success: false,
      error: 'Failed to create feedback. Please try again.',
    };
  }
}
// ============================================
// UPDATE FEEDBACK ACTION
// ============================================
export async function updateFeedbackAction(
  feedbackId: number,
  formData: FormData
): Promise<ActionResponse<Feedback>> {
  try {
    const userId = await getOrCreateUserId();
    const existingFeedback = await feedbackQueries.getFeedbackById(feedbackId);
    
    if (!existingFeedback) {
      return { success: false, error: 'Feedback not found' };
    }
    
    if (existingFeedback.userId !== userId) {
      return { 
        success: false, 
        error: 'You can only edit your own feedback' 
      };
    }
    
    const userName = formData.get('userName') as string;
    const content = formData.get('content') as string;
    const ratingStr = formData.get('rating') as string;
    
    if (!userName || userName.trim().length === 0) {
      return { success: false, error: 'Name is required' };
    }
    
    if (!content || content.trim().length < 10) {
      return { success: false, error: 'Feedback must be at least 10 characters' };
    }
    
    const rating = parseFloat(ratingStr);
    if (isNaN(rating) || rating < 0.5 || rating > 5) {
      return { success: false, error: 'Rating must be between 0.5 and 5' };
    }
    
    const validRatings: Rating[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    if (!validRatings.includes(rating as Rating)) {
      return { success: false, error: 'Invalid rating value' };
    }
    
    const updatedFeedback = await feedbackQueries.updateFeedback(feedbackId, {
      userName: userName.trim(),
      content: content.trim(),
      rating: rating as Rating,
    });
    
    if (!updatedFeedback) {
      return { success: false, error: 'Failed to update feedback' };
    }
    
    revalidatePath('/');
    revalidatePath('/feedback');
    
    return {
      success: true,
      data: updatedFeedback,
    };
    
  } catch (error) {
    console.error('Update feedback error:', error);
    return {
      success: false,
      error: 'Failed to update feedback. Please try again.',
    };
  }
}

// ============================================
// DELETE FEEDBACK ACTION
// ============================================
export async function deleteFeedbackAction(
  feedbackId: number
): Promise<ActionResponse<void>> {
  try {
    // ✅ Используем getOrCreateUserId() в Server Action
    const userId = await getOrCreateUserId();
    
    const existingFeedback = await feedbackQueries.getFeedbackById(feedbackId);
    
    if (!existingFeedback) {
      return { success: false, error: 'Feedback not found' };
    }
    
    if (existingFeedback.userId !== userId) {
      return {
        success: false,
        error: 'You can only delete your own feedback',
      };
    }
    
    const deleted = await feedbackQueries.deleteFeedback(feedbackId);
    
    if (!deleted) {
      return { success: false, error: 'Failed to delete feedback' };
    }
    
    revalidatePath('/');
    revalidatePath('/feedback');
    
    return {
      success: true,
      data: undefined,
    };
    
  } catch (error) {
    console.error('Delete feedback error:', error);
    return {
      success: false,
      error: 'Failed to delete feedback. Please try again.',
    };
  }
}