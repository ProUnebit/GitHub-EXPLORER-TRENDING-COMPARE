import { CACHE_REVALIDATION } from '@/config/constants';
import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
    GitHubLanguages,
    GitHubCommit,
    SearchParams,
    GitHubIssue,
    IssuesAnalytics,
    LabelStats,
    IssueContributor,
    IssueTimelineData,
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

// ============================================
// ISSUES API
// ============================================

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
    perPage: number = 100
): Promise<GitHubIssue[]> {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}&sort=created&direction=desc`,
        {
            headers: getHeaders(),
            next: {
                revalidate: CACHE_REVALIDATION.DYNAMIC, // 5 минут
            },
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
    // В реальности нужен отдельный API запрос для точного времени
    const avgResponseTime = 4; // Заглушка, можно улучшить

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
        .slice(0, 5);

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
            commentsCount: 0, // Заглушка, можно улучшить
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
 * ПОЧЕМУ ТАК:
 * - Группируем issues по месяцам
 * - Считаем open/closed на каждый месяц
 * - Показываем динамику
 */
function generateTimeline(issues: GitHubIssue[]): IssueTimelineData[] {
    const timeline: IssueTimelineData[] = [];
    const now = new Date();

    // Последние 6 месяцев
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        // Issues созданные в этом месяце
        const monthIssues = issues.filter((issue) => {
            const created = new Date(issue.created_at);
            return created >= date && created < nextMonth;
        });

        const open = monthIssues.filter((i) => i.state === 'open').length;
        const closed = monthIssues.filter((i) => i.state === 'closed').length;

        timeline.push({ date: dateStr, open, closed });
    }

    return timeline;
}
