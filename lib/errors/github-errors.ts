// lib/errors/github-errors.ts

/**
 * ============================================
 * CUSTOM ERROR CLASSES
 * ============================================
 * 
 * Типизированные ошибки для GitHub API
 * 
 * Зачем нужно:
 * - Различать типы ошибок (404, 403, 5xx)
 * - Показывать правильные UI messages
 * - Логировать structured errors
 * - Retry logic для определенных ошибок
 */

// ============================================
// BASE GITHUB API ERROR
// ============================================
export class GitHubAPIError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public endpoint: string,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'GitHubAPIError';
        
        // Сохраняем stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Можно ли сделать retry этой ошибки?
     */
    isRetryable(): boolean {
        // 5xx errors - server issues, retry ok
        if (this.statusCode >= 500) return true;
        
        // 429 - rate limit, retry с backoff
        if (this.statusCode === 429) return true;
        
        // Client errors (4xx) - не retry
        return false;
    }

    /**
     * Форматированное сообщение для UI
     */
    getUserMessage(): string {
        if (this.statusCode === 404) {
            return 'Resource not found. Please check the repository name.';
        }
        if (this.statusCode === 403) {
            return 'Access forbidden. This might be a private repository.';
        }
        if (this.statusCode === 422) {
            return 'Invalid request. Please check your search query.';
        }
        if (this.statusCode >= 500) {
            return 'GitHub servers are experiencing issues. Please try again later.';
        }
        return 'An unexpected error occurred. Please try again.';
    }
}

// ============================================
// RATE LIMIT ERROR (403)
// ============================================
export class RateLimitError extends GitHubAPIError {
    constructor(
        public resetAt: Date,
        endpoint: string
    ) {
        const message = `Rate limit exceeded. Resets at ${resetAt.toLocaleTimeString()}`;
        super(message, 403, endpoint);
        this.name = 'RateLimitError';
    }

    /**
     * Сколько секунд до reset
     */
    getSecondsUntilReset(): number {
        return Math.max(0, Math.floor((this.resetAt.getTime() - Date.now()) / 1000));
    }

    getUserMessage(): string {
        const minutes = Math.ceil(this.getSecondsUntilReset() / 60);
        return `Rate limit exceeded. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
    }
}

// ============================================
// NOT FOUND ERROR (404)
// ============================================
export class NotFoundError extends GitHubAPIError {
    constructor(
        public resourceType: 'repository' | 'user' | 'file',
        public resourceName: string,
        endpoint: string
    ) {
        const message = `${resourceType} "${resourceName}" not found`;
        super(message, 404, endpoint);
        this.name = 'NotFoundError';
    }

    getUserMessage(): string {
        const article = this.resourceType === 'user' ? 'User' : 'Repository';
        return `${article} "${this.resourceName}" not found or is private.`;
    }
}

// ============================================
// VALIDATION ERROR (422)
// ============================================
export class ValidationError extends GitHubAPIError {
    constructor(
        public validationErrors: string[],
        endpoint: string
    ) {
        const message = `Validation failed: ${validationErrors.join(', ')}`;
        super(message, 422, endpoint);
        this.name = 'ValidationError';
    }

    getUserMessage(): string {
        return `Invalid request: ${this.validationErrors.join('. ')}`;
    }
}

// ============================================
// NETWORK ERROR (connection issues)
// ============================================
export class NetworkError extends Error {
    constructor(
        message: string,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'NetworkError';
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    getUserMessage(): string {
        return 'Network connection failed. Please check your internet connection.';
    }
}

// ============================================
// TYPE GUARDS
// ============================================
export function isGitHubAPIError(error: unknown): error is GitHubAPIError {
    return error instanceof GitHubAPIError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
    return error instanceof RateLimitError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
    return error instanceof NotFoundError;
}

export function isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
}

// ============================================
// ERROR PARSER
// ============================================
/**
 * Парсит Response в typed error
 */
export async function parseGitHubError(
    response: Response,
    endpoint: string
): Promise<GitHubAPIError> {
    const statusCode = response.status;

    // Try to parse error body
    let errorBody: any = {};
    try {
        errorBody = await response.json();
    } catch {
        // If can't parse, use default message
    }

    // Rate Limit (403 with X-RateLimit-Reset header)
    const rateLimitReset = response.headers.get('X-RateLimit-Reset');
    if (statusCode === 403 && rateLimitReset) {
        const resetAt = new Date(parseInt(rateLimitReset) * 1000);
        return new RateLimitError(resetAt, endpoint);
    }

    // Not Found (404)
    if (statusCode === 404) {
        // Try to extract resource info from endpoint
        const match = endpoint.match(/\/repos\/([^/]+)\/([^/]+)/);
        if (match) {
            return new NotFoundError('repository', `${match[1]}/${match[2]}`, endpoint);
        }
        return new NotFoundError('repository', 'Unknown', endpoint);
    }

    // Validation Error (422)
    if (statusCode === 422 && errorBody.errors) {
        const errors = errorBody.errors.map((e: any) => e.message || e.code);
        return new ValidationError(errors, endpoint);
    }

    // Generic GitHub API Error
    const message = errorBody.message || response.statusText || 'Unknown error';
    return new GitHubAPIError(message, statusCode, endpoint, errorBody);
}
