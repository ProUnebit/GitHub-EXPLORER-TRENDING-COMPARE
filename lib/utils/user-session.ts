import { cookies } from 'next/headers';

// CONSTANTS

const USER_ID_COOKIE_NAME = 'github-explorer-user-id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 год в секундах


// GET USER ID (READ ONLY)

/**
 * Получает userId из cookie (только чтение, без создания нового)
 *
 * Используется в Server Components для чтения существующего ID
 * Если cookie нет - возвращает временный ID на основе timestamp
 *
 * @returns Promise<string> - userId из cookie или временный ID
 */
export async function getUserId(): Promise<string> {
    const cookieStore = await cookies();

    // Пытаемся получить существующий userId из cookie
    const existingUserId = cookieStore.get(USER_ID_COOKIE_NAME)?.value;

    if (existingUserId) {
        return existingUserId;
    }

    // Если cookie нет - возвращаем временный ID
    // Реальный cookie будет создан при первом Server Action (создание отзыва)
    return generateTempUserId();
}


// GET OR CREATE USER ID (READ + WRITE)

/**
 * Получает или создает userId в cookie
 *
 * МОЖНО ИСПОЛЬЗОВАТЬ ТОЛЬКО В:
 * - Server Actions ('use server' функции)
 * - Route Handlers (API routes)
 *
 * НЕЛЬЗЯ использовать в Server Components при рендеринге!
 *
 * @returns Promise<string> - userId
 */
export async function getOrCreateUserId(): Promise<string> {
    const cookieStore = await cookies();

    // Пытаемся получить существующий userId из cookie
    const existingUserId = cookieStore.get(USER_ID_COOKIE_NAME)?.value;

    if (existingUserId) {
        return existingUserId;
    }

    // Новый пользователь - генерируем ID
    const newUserId = generateUserId();

    // Сохраняем в httpOnly cookie
    cookieStore.set(USER_ID_COOKIE_NAME, newUserId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    });

    return newUserId;
}


// GENERATE UNIQUE USER ID

/**
 * Генерирует уникальный ID пользователя (постоянный)
 * Используется при создании cookie
 */
function generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    return `user_${timestamp}_${random}`;
}


// GENERATE TEMPORARY USER ID

/**
 * Генерирует временный ID для пользователей без cookie
 * Этот ID не сохраняется и меняется при каждой загрузке страницы
 *
 * Используется только для чтения (определение isOwner), не для записи в БД
 */
function generateTempUserId(): string {
    // Используем более стабильный временный ID
    // В реальности, без cookie пользователь не сможет создать отзыв
    return `temp_${Date.now()}`;
}


// CHECK IF USER EXISTS

/**
 * Проверяет есть ли у пользователя уже userId cookie
 */
export async function hasUserId(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(USER_ID_COOKIE_NAME);
}
