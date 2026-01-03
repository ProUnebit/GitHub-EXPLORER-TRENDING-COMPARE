import { CACHE_REVALIDATION } from '@/config/constants';
import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
    GitHubLanguages,
    GitHubCommit,
    SearchParams,
} from './types';
import { toast } from 'sonner';

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
        const message =
            error.message || `GitHub API error: ${response.statusText}`;

        // toast.error('API Error', { description: message });

        throw new Error(message);
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
    since: 'daily' | 'weekly' | 'monthly' | 'year' = 'weekly'
): Promise<GitHubSearchResponse> {
    const date = new Date();

    // Вычисляем дату для фильтра
    // Описываем мапу трансформаций даты
    // Record<typeof since, ...> гарантирует, что мы не забудем обработать все типы периода
    const dateAdjusters: Record<typeof since, (d: Date) => void> = {
        daily: (d) => d.setDate(d.getDate() - 1),
        weekly: (d) => d.setDate(d.getDate() - 7),
        monthly: (d) => d.setMonth(d.getMonth() - 1),
        year: (d) => d.setFullYear(d.getFullYear() - 1),
    };

    // Вызываем нужный метод из мапы
    dateAdjusters[since](date);

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

/**
 * CLIENT-SIDE: Поиск репозиториев для infinite scroll
 * Используется в Client Components для подгрузки следующих страниц
 *
 * Отличия от searchRepositories:
 * - Без next.revalidate (не работает на клиенте)
 * - Без server-side кеширования
 * - Для динамической подгрузки данных
 */
export async function searchRepositoriesClient(
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

    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    // На клиенте используем обычный fetch без Next.js кеширования
    const response = await fetch(
        `${GITHUB_API_BASE}/search/repositories?${searchParams}`,
        {
            headers,
            cache: 'no-store', // Всегда свежие данные
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const message =
            error.message || `GitHub API error: ${response.statusText}`;

        // Toast будет показан в компоненте, здесь только throw
        throw new Error(message);
    }

    return response.json();
}

/**
 * Получить содержимое файла из репозитория
 */
export async function getRepoFile(
    owner: string,
    repo: string,
    path: string
): Promise<string | null> {
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: getHeaders(),
                next: {
                    revalidate: CACHE_REVALIDATION.STATIC, // 1 час
                },
            }
        );

        if (!response.ok) {
            return null; // Файл не найден
        }

        const data = await response.json();

        // GitHub API возвращает base64 encoded content
        if (data.content) {
            const decoded = Buffer.from(data.content, 'base64').toString(
                'utf-8'
            );
            return decoded;
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch file ${path}:`, error);
        return null;
    }
}

/**
 * Получить package.json из репозитория
 */
export async function getPackageJson(
    owner: string,
    repo: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
    const content = await getRepoFile(owner, repo, 'package.json');

    if (!content) {
        return null;
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        console.error('Failed to parse package.json:', error);
        return null;
    }
}
