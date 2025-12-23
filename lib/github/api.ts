import { CACHE_REVALIDATION } from '@/config/constants';
import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
    GitHubLanguages,
    GitHubCommit,
    SearchParams,
} from './types';

const GITHUB_API_BASE = 'https://api.github.com';

// Helper для создания headers
function getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    // Если есть токен - добавляем (опционально)
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    return headers;
}

// Helper для обработки ошибок
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.message || `GitHub API error: ${response.statusText}`
        );
    }
    return response.json();
}

/**
 * Поиск репозиториев
 * Server Component - можем использовать напрямую
 */
export async function searchRepositories(
    params: SearchParams
): Promise<GitHubSearchResponse> {
    const {
        q,
        sort = 'stars',
        order = 'desc',
        per_page = 30,
        page = 1,
    } = params;

    const searchParams = new URLSearchParams({
        q,
        sort,
        order,
        per_page: per_page.toString(),
        page: page.toString(),
    });

    const response = await fetch(
        `${GITHUB_API_BASE}/search/repositories?${searchParams}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE_REVALIDATION.DYNAMIC, // 5 минут
            },
        }
    );

    return handleResponse<GitHubSearchResponse>(response);
}

/**
 * Получить детальную информацию о репозитории
 */
export async function getRepository(
    owner: string,
    repo: string
): Promise<GitHubRepo> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: getHeaders(),
        next: {
            revalidate: CACHE_REVALIDATION.STATIC, // 1 час
        },
    });

    return handleResponse<GitHubRepo>(response);
}

/**
 * Получить список контрибьюторов
 */
export async function getContributors(
    owner: string,
    repo: string,
    perPage: number = 10
): Promise<GitHubContributor[]> {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE_REVALIDATION.STATIC,
            },
        }
    );

    return handleResponse<GitHubContributor[]>(response);
}

/**
 * Получить статистику по языкам
 */
export async function getLanguages(
    owner: string,
    repo: string
): Promise<GitHubLanguages> {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE_REVALIDATION.STATIC,
            },
        }
    );

    return handleResponse<GitHubLanguages>(response);
}

/**
 * Получить последние коммиты
 */
export async function getCommits(
    owner: string,
    repo: string,
    perPage: number = 10
): Promise<GitHubCommit[]> {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE_REVALIDATION.DYNAMIC,
            },
        }
    );

    return handleResponse<GitHubCommit[]>(response);
}

/**
 * Получить trending репозитории (используем GitHub Search)
 */
export async function getTrendingRepositories(
    language?: string,
    since: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<GitHubSearchResponse> {
    const date = new Date();

    // Вычисляем дату для фильтра
    if (since === 'daily') {
        date.setDate(date.getDate() - 1);
    } else if (since === 'weekly') {
        date.setDate(date.getDate() - 7);
    } else {
        date.setMonth(date.getMonth() - 1);
    }

    const dateStr = date.toISOString().split('T')[0];

    // Строим запрос
    let query = `created:>${dateStr}`;
    if (language) {
        query += ` language:${language}`;
    }

    return searchRepositories({
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 30,
    });
}
