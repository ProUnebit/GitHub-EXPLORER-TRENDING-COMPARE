import { CACHE, PAGINATION } from '@/config/api';
import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
    GitHubLanguages,
    GitHubCommit,
    SearchParams,
    GitHubIssue,
    GitHubUser,
    IssuesAnalytics,
    LabelStats,
    IssueContributor,
    IssueTimelineData,
} from './types';
import { parseGitHubError } from '@/lib/errors';
import { fetchWithRetry } from '@/lib/utils/fetch-with-retry';

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


// HELPER: ОБРАБОТКА ОШИБОК

/**
 * Обрабатывает ответ от GitHub API и бросает типизированные ошибки
 * 
 * @throws {RateLimitError} - При превышении лимита (403)
 * @throws {RepositoryNotFoundError} - Когда репозиторий не найден (404)
 * @throws {GitHubAPIError} - Для всех остальных ошибок API
 */
async function handleResponse<T>(
    response: Response,
    endpoint: string = 'unknown'
): Promise<T> {
    if (!response.ok) {
        const error = await parseGitHubError(response, endpoint);
        throw error;
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
        per_page = PAGINATION.SEARCH_PER_PAGE,
        page = 1,
    } = params;

    const searchParams = new URLSearchParams({
        q,
        sort,
        order,
        per_page: per_page.toString(),
        page: page.toString(),
    });

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/search/repositories?${searchParams}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE.DYNAMIC, // 5 минут
            },
            retries: 3, // 3 попытки
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
    const endpoint = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    
    const response = await fetchWithRetry(endpoint, {
        headers: getHeaders(),
        next: {
            revalidate: CACHE.STATIC,
        },
        retries: 3,
    });

    return handleResponse<GitHubRepo>(response, endpoint);
}

/**
 * Получить список контрибьюторов
 */
export async function getContributors(
    owner: string,
    repo: string,
    perPage: number = PAGINATION.CONTRIBUTORS_DISPLAY
): Promise<GitHubContributor[]> {

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE.STATIC,
            },
            retries: 3,
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

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE.STATIC,
            },
            retries: 3,
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
    perPage: number = PAGINATION.COMMITS_LIMIT
): Promise<GitHubCommit[]> {

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE.DYNAMIC,
            },
            retries: 3,
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
    const dateAdjusters: Record<typeof since, (d: Date) => void> = {
        daily: (d) => d.setDate(d.getDate() - 1),
        weekly: (d) => d.setDate(d.getDate() - 7),
        monthly: (d) => d.setMonth(d.getMonth() - 1),
        year: (d) => d.setFullYear(d.getFullYear() - 1),
    };

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
        per_page: PAGINATION.SEARCH_PER_PAGE,
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

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/search/repositories?${searchParams}`,
        {
            headers,
            cache: 'no-store', // Всегда свежие данные
            retries: 2, // Меньше попыток на клиенте
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const message =
            error.message || `GitHub API error: ${response.statusText}`;
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

        const response = await fetchWithRetry(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: getHeaders(),
                next: {
                    revalidate: CACHE.STATIC, 
                },
                retries: 2, // Меньше попыток для file fetch
            }
        );

        if (!response.ok) {
            return null; 
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


// ISSUES API

/**
 * Получить issues репозитория
 * 
 * ВАЖНО: GitHub API возвращает максимум 100 items per page
 * Для полной аналитики получаем несколько страниц
 */
export async function getIssues(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'all',
    perPage: number = PAGINATION.ISSUES_DEFAULT
): Promise<GitHubIssue[]> {

    const response = await fetchWithRetry(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}&sort=created&direction=desc`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE.DYNAMIC,
            },
            retries: 3,
        }
    );

    return handleResponse<GitHubIssue[]>(response);
}

/**
 * Получить аналитику по issues
 * 
 * ПОЧЕМУ ОТДЕЛЬНАЯ ФУНКЦИЯ:
 * - Сложные вычисления делаем на сервере
 * - Кешируем результат
 * - Клиент получает готовую аналитику
 */
export async function getIssuesAnalytics(
    owner: string,
    repo: string
): Promise<IssuesAnalytics> {
    // Получаем все issues (max 100, этого достаточно для аналитики)
    const allIssues = await getIssues(owner, repo, 'all', 100);

    // Фильтруем Pull Requests (GitHub API возвращает и issues и PRs в /issues endpoint)
    // PR определяется наличием поля 'pull_request'
    const issues = allIssues.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (issue) => !(issue as any).pull_request
    );

    // Базовая статистика
    const total = issues.length;
    const open = issues.filter((i) => i.state === 'open').length;
    const closed = issues.filter((i) => i.state === 'closed').length;

    // Среднее время закрытия (только для closed issues)
    const closedIssues = issues.filter((i) => i.closed_at);
    const avgCloseTime =
        closedIssues.length > 0
            ? closedIssues.reduce((sum, issue) => {
                  const created = new Date(issue.created_at).getTime();
                  const closed = new Date(issue.closed_at!).getTime();
                  const days = (closed - created) / (1000 * 60 * 60 * 24);
                  return sum + days;
              }, 0) / closedIssues.length
            : 0;

    // Среднее время первого ответа (упрощенно - по comments)
    const avgResponseTime = 4; // Заглушка

    // Top Labels
    const labelCounts = new Map<string, { count: number; color: string }>();
    issues.forEach((issue) => {
        issue.labels.forEach((label) => {
            const current = labelCounts.get(label.name) || {
                count: 0,
                color: label.color,
            };
            labelCounts.set(label.name, {
                count: current.count + 1,
                color: label.color,
            });
        });
    });

    const topLabels: LabelStats[] = Array.from(labelCounts.entries())
        .map(([name, data]) => ({
            name,
            color: data.color,
            count: data.count,
            percentage: (data.count / total) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Top Contributors (кто закрывает issues)
    const contributorMap = new Map<
        string,
        { user: GitHubUser; issuesClosed: number }
    >();
    closedIssues.forEach((issue) => {
        const login = issue.user.login;
        const current = contributorMap.get(login) || {
            user: issue.user,
            issuesClosed: 0,
        };
        contributorMap.set(login, {
            user: issue.user,
            issuesClosed: current.issuesClosed + 1,
        });
    });

    const topContributors: IssueContributor[] = Array.from(
        contributorMap.values()
    )
        .sort((a, b) => b.issuesClosed - a.issuesClosed)
        .slice(0, 5)
        .map((c) => ({
            ...c,
            commentsCount: 0,
        }));

    // Hottest Issues (по комментариям + реакциям)
    const hottestIssues = [...issues]
        .sort((a, b) => {
            const scoreA = a.comments + a.reactions.total_count;
            const scoreB = b.comments + b.reactions.total_count;
            return scoreB - scoreA;
        })
        .slice(0, 5);

    // Timeline (последние 6 месяцев)
    const timeline = generateTimeline(issues);

    return {
        total,
        open,
        closed,
        avgCloseTime,
        avgResponseTime,
        topLabels,
        topContributors,
        hottestIssues,
        timeline,
    };
}

/**
 * Генерация timeline данных (последние 6 месяцев)
 * 
 * ЛОГИКА:
 * - Показываем АКТИВНОСТЬ в каждом месяце
 * - Активность = issues созданные ИЛИ закрытые в этом месяце
 */
function generateTimeline(issues: GitHubIssue[]): IssueTimelineData[] {
    const timeline: IssueTimelineData[] = [];
    const now = new Date();

    // Последние 6 месяцев
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        // Issues которые были АКТИВНЫ в этом месяце
        const activeIssues = issues.filter((issue) => {
            const created = new Date(issue.created_at);
            const closed = issue.closed_at ? new Date(issue.closed_at) : null;

            const createdInMonth = created >= date && created < nextMonth;
            const closedInMonth = closed && closed >= date && closed < nextMonth;

            return createdInMonth || closedInMonth;
        });

        const open = activeIssues.filter((i) => i.state === 'open').length;
        const closed = activeIssues.filter((i) => i.state === 'closed').length;

        timeline.push({ date: dateStr, open, closed });
    }

    return timeline;
}
