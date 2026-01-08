// lib/errors/index.ts

/**
 * ============================================
 * ERRORS BARREL EXPORT
 * ============================================
 * 
 * Центральная точка экспорта всех error types
 */

export {
    GitHubAPIError,
    RateLimitError,
    NotFoundError,
    ValidationError,
    NetworkError,
    isGitHubAPIError,
    isRateLimitError,
    isNotFoundError,
    isNetworkError,
    parseGitHubError,
} from './github-errors';
