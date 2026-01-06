import type { Rating } from '@/db/schema';

/**
 * ============================================
 * FEEDBACK QUERIES
 * ============================================
 *
 * Централизованное место для всех запросов к таблице feedback
 *
 * Архитектурный паттерн: Repository Pattern
 * - Все SQL логика изолирована в одном месте
 * - Server Actions просто вызывают эти функции
 * - Легко тестировать и мокать
 */

import { db } from '@/db';
import { feedback, type Feedback, type NewFeedback } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

// ============================================
// GET ALL FEEDBACKS
// ============================================
/**
 * Получить все отзывы, отсортированные по дате создания (новые первые)
 *
 * @returns Promise<Feedback[]> - массив отзывов
 *
 * SQL эквивалент:
 * SELECT * FROM feedback ORDER BY created_at DESC;
 */
export async function getAllFeedbacks(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt)); // desc = descending (по убыванию)
}

// ============================================
// GET FEEDBACK BY ID
// ============================================
/**
 * Получить конкретный отзыв по ID
 *
 * @param id - ID отзыва
 * @returns Promise<Feedback | undefined> - отзыв или undefined если не найден
 *
 * SQL эквивалент:
 * SELECT * FROM feedback WHERE id = $1 LIMIT 1;
 */
export async function getFeedbackById(
    id: number
): Promise<Feedback | undefined> {
    const result = await db
        .select()
        .from(feedback)
        .where(eq(feedback.id, id)) // eq = equals (равно)
        .limit(1);

    return result[0]; // Возвращаем первый элемент или undefined
}

// ============================================
// GET FEEDBACKS BY USER ID
// ============================================
/**
 * Получить все отзывы конкретного пользователя
 *
 * Используется для:
 * - Проверки "есть ли у пользователя отзыв?"
 * - Показа "мой отзыв" на отдельной странице
 *
 * @param userId - ID пользователя из cookie
 * @returns Promise<Feedback[]> - массив отзывов пользователя
 *
 * SQL эквивалент:
 * SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC;
 */
export async function getFeedbacksByUserId(
    userId: string
): Promise<Feedback[]> {
    return await db
        .select()
        .from(feedback)
        .where(eq(feedback.userId, userId))
        .orderBy(desc(feedback.createdAt));
}

// ============================================
// GET USER'S FEEDBACK (SINGLE)
// ============================================
/**
 * Получить отзыв пользователя (предполагаем что один пользователь = один отзыв)
 *
 * Используется для:
 * - Проверки "есть ли уже отзыв у пользователя?"
 * - Получения ID отзыва для редактирования
 *
 * @param userId - ID пользователя
 * @returns Promise<Feedback | undefined> - отзыв или undefined
 */
export async function getUserFeedback(
    userId: string
): Promise<Feedback | undefined> {
    const result = await db
        .select()
        .from(feedback)
        .where(eq(feedback.userId, userId))
        .limit(1); // Берём только первый (предполагаем один отзыв на пользователя)

    return result[0];
}

// ============================================
// GET AVERAGE RATING
// ============================================
/**
 * Получить средний рейтинг всех отзывов
 *
 * Используется для:
 * - Показа общего рейтинга проекта на странице /feedback
 * - Статистики
 *
 * @returns Promise<number> - средний рейтинг (например, 4.7)
 *
 * SQL эквивалент:
 * SELECT AVG(rating) FROM feedback;
 */
export async function getAverageRating(): Promise<number> {
    const result = await db
        .select({
            // sql`AVG(${feedback.rating})` - используем raw SQL для aggregate функции
            // :: - PostgreSQL cast (приведение типа)
            // NUMERIC - тип для точных чисел с плавающей точкой
            avg: sql<number>`AVG(${feedback.rating})::NUMERIC`,
        })
        .from(feedback);

    // result[0].avg может быть null если нет отзывов
    const avg = result[0]?.avg ?? 0;

    // Округляем до 1 знака после запятой (4.7, 4.3, etc)
    return Math.round(avg * 10) / 10;
}

// ============================================
// GET RATING DISTRIBUTION
// ============================================
/**
 * Получить распределение рейтингов (сколько отзывов на каждую звезду)
 *
 * Используется для:
 * - Показа bar chart "5★: 120, 4★: 45, ..."
 *
 * @returns Promise<{rating: number, count: number}[]>
 *
 * SQL эквивалент:
 * SELECT rating, COUNT(*) as count
 * FROM feedback
 * GROUP BY rating
 * ORDER BY rating DESC;
 */
export async function getRatingDistribution(): Promise<
    Array<{ rating: number; count: number }>
> {
    return await db
        .select({
            rating: sql<number>`ROUND(${feedback.rating})::INTEGER`,
            count: sql<number>`COUNT(*)::INTEGER`,
        })
        .from(feedback)
        .groupBy(sql`ROUND(${feedback.rating})`) 
        .orderBy(sql`ROUND(${feedback.rating}) DESC`); 
}

// ============================================
// GET TOTAL COUNT
// ============================================
/**
 * Получить общее количество отзывов
 *
 * @returns Promise<number> - количество отзывов
 *
 * SQL эквивалент:
 * SELECT COUNT(*) FROM feedback;
 */
export async function getFeedbackCount(): Promise<number> {
    const result = await db
        .select({
            count: sql<number>`COUNT(*)::INTEGER`,
        })
        .from(feedback);

    return result[0]?.count ?? 0;
}

// ============================================
// CREATE FEEDBACK
// ============================================
/**
 * Создать новый отзыв
 *
 * @param data - данные для создания отзыва
 * @returns Promise<Feedback> - созданный отзыв
 *
 * SQL эквивалент:
 * INSERT INTO feedback (user_id, user_name, content, rating)
 * VALUES ($1, $2, $3, $4)
 * RETURNING *;
 */
export async function createFeedback(data: NewFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values({...data}).returning(); // RETURNING * - возвращает созданную запись

    return result[0];
}

// ============================================
// UPDATE FEEDBACK
// ============================================
/**
 * Обновить существующий отзыв
 *
 * @param id - ID отзыва
 * @param data - данные для обновления
 * @returns Promise<Feedback | undefined> - обновленный отзыв
 *
 * SQL эквивалент:
 * UPDATE feedback
 * SET content = $1, rating = $2, edited = true, updated_at = NOW()
 * WHERE id = $3
 * RETURNING *;
 */
export async function updateFeedback(
    id: number,
    data: {
        content?: string;
        rating?: Rating | string;
        userName?: string;
    }
): Promise<Feedback | undefined> {

    const updateData: any = {
        ...data,
        edited: true,
        updatedAt: new Date(),
    };
    
    // Если rating передан - конвертируем в строку
    if (data.rating !== undefined) {
        updateData.rating = data.rating.toString();
    }

    const result = await db
        .update(feedback)
        .set(updateData)
        .where(eq(feedback.id, id))
        .returning();

    return result[0];
}

// ============================================
// DELETE FEEDBACK
// ============================================
/**
 * Удалить отзыв
 *
 * @param id - ID отзыва
 * @returns Promise<boolean> - true если удален, false если не найден
 *
 * SQL эквивалент:
 * DELETE FROM feedback WHERE id = $1 RETURNING *;
 */
export async function deleteFeedback(id: number): Promise<boolean> {
    const result = await db
        .delete(feedback)
        .where(eq(feedback.id, id))
        .returning();

    return result.length > 0; // Если вернулась хоть одна запись = удалено успешно
}

// ============================================
// CHECK IF USER HAS FEEDBACK
// ============================================
/**
 * Проверить есть ли у пользователя уже отзыв
 *
 * Используется для:
 * - Условного рендеринга "Add Feedback" vs "Edit Feedback"
 * - Валидации (один пользователь = один отзыв)
 *
 * @param userId - ID пользователя
 * @returns Promise<boolean> - true если есть отзыв
 */
export async function userHasFeedback(userId: string): Promise<boolean> {
    const result = await db
        .select({ id: feedback.id })
        .from(feedback)
        .where(eq(feedback.userId, userId))
        .limit(1);

    return result.length > 0;
}
