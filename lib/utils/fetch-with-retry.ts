// lib/utils/fetch-with-retry.ts

/**
 * ============================================
 * FETCH WITH RETRY
 * ============================================
 * 
 * Надежная обертка над fetch с retry логикой
 * 
 * Фичи:
 * - Exponential backoff (2^n * 1000ms)
 * - Умный retry (не retry 404, 403)
 * - Timeout поддержка
 * - TypeScript типизация
 * 
 * Когда retry:
 * - Network errors
 * - 5xx server errors
 * - Timeout errors
 * 
 * Когда НЕ retry:
 * - 404 Not Found
 * - 403 Forbidden (rate limit)
 * - 401 Unauthorized
 * - 400 Bad Request
 */

type FetchWithRetryOptions = RequestInit & {
    retries?: number;
    timeout?: number;
};

/**
 * Sleep utility для exponential backoff
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Проверяет нужно ли retry для данного статуса
 */
function shouldRetry(status: number): boolean {
    // НЕ retry client errors (4xx)
    if (status >= 400 && status < 500) {
        return false;
    }
    
    // Retry server errors (5xx)
    if (status >= 500) {
        return true;
    }
    
    return false;
}

/**
 * Fetch с автоматическим retry и exponential backoff
 * 
 * @param url - URL для запроса
 * @param options - RequestInit + дополнительные опции
 * @returns Promise<Response>
 * 
 * @example
 * const response = await fetchWithRetry(
 *   'https://api.github.com/repos/facebook/react',
 *   { retries: 3, timeout: 5000 }
 * );
 */
export async function fetchWithRetry(
    url: string,
    options: FetchWithRetryOptions = {}
): Promise<Response> {
    const { 
        retries = 3, 
        timeout = 10000, 
        ...fetchOptions 
    } = options;
    
    let lastError: Error | null = null;
    
    // Попытки с retry
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // Создаем AbortController для timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            try {
                // Выполняем fetch
                const response = await fetch(url, {
                    ...fetchOptions,
                    signal: controller.signal,
                });
                
                // Успешный response
                if (response.ok) {
                    return response;
                }
                
                // Проверяем нужен ли retry
                if (!shouldRetry(response.status)) {
                    // Не retry для 4xx ошибок
                    return response;
                }
                
                // Server error (5xx) - будем retry
                if (attempt < retries - 1) {
                    // Exponential backoff: 1s, 2s, 4s
                    const delay = Math.pow(2, attempt) * 1000;
                    console.warn(
                        `Retry ${attempt + 1}/${retries} after ${delay}ms for ${url} (status: ${response.status})`
                    );
                    await sleep(delay);
                    continue;
                }
                
                // Последняя попытка - возвращаем response
                return response;
                
            } finally {
                clearTimeout(timeoutId);
            }
            
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            
            // AbortError (timeout) или Network error
            if (attempt < retries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(
                    `Retry ${attempt + 1}/${retries} after ${delay}ms for ${url} (error: ${lastError.message})`
                );
                await sleep(delay);
                continue;
            }
            
            // Последняя попытка - throw error
            throw lastError;
        }
    }
    
    // Не должны сюда попасть, но на всякий случай
    throw lastError || new Error('Max retries reached');
}

/**
 * Wrapper для JSON response с retry
 * 
 * @example
 * const data = await fetchJSON<Repo>('https://api.github.com/repos/facebook/react');
 */
export async function fetchJSON<T>(
    url: string,
    options?: FetchWithRetryOptions
): Promise<T> {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.message || `HTTP ${response.status}: ${response.statusText}`
        );
    }
    
    return response.json();
}
