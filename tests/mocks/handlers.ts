import { http, HttpResponse } from 'msw';
import {
    mockSearchResponse,
    mockSearchResponsePage2,
    mockRepo,
    mockContributors,
    mockLanguages,
} from './fixtures';

// ============================================
// MSW HANDLERS - Моки GitHub API
// ============================================
// Перехватываем все запросы к api.github.com

const GITHUB_API = 'https://api.github.com';

export const handlers = [
    // Search repositories
    http.get(`${GITHUB_API}/search/repositories`, ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        const page = url.searchParams.get('page');
        const perPage = url.searchParams.get('per_page');

        // Проверка разных сценариев
        if (query?.includes('notfound')) {
            return HttpResponse.json({
                total_count: 0,
                incomplete_results: false,
                items: [],
            });
        }

        if (query?.includes('error')) {
            return HttpResponse.json(
                { message: 'API rate limit exceeded' },
                { status: 403 }
            );
        }

        // Пагинация
        if (page === '2') {
            return HttpResponse.json(mockSearchResponsePage2);
        }

        return HttpResponse.json(mockSearchResponse);
    }),

    // Get single repository
    http.get(`${GITHUB_API}/repos/:owner/:repo`, ({ params }) => {
        const { owner, repo } = params;

        if (repo === 'notfound') {
            return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
        }

        return HttpResponse.json(mockRepo);
    }),

    // Get contributors
    http.get(`${GITHUB_API}/repos/:owner/:repo/contributors`, () => {
        return HttpResponse.json(mockContributors);
    }),

    // Get languages
    http.get(`${GITHUB_API}/repos/:owner/:repo/languages`, () => {
        return HttpResponse.json(mockLanguages);
    }),

    // Get commits
    http.get(`${GITHUB_API}/repos/:owner/:repo/commits`, () => {
        return HttpResponse.json([
            {
                sha: 'abc123',
                commit: {
                    author: {
                        name: 'Dan Abramov',
                        email: 'dan@example.com',
                        date: '2024-12-30T10:00:00Z',
                    },
                    message: 'Fix: Update hooks implementation',
                },
                html_url: 'https://github.com/facebook/react/commit/abc123',
                author: {
                    login: 'gaearon',
                    id: 810438,
                    avatar_url:
                        'https://avatars.githubusercontent.com/u/810438',
                    html_url: 'https://github.com/gaearon',
                    type: 'User',
                },
            },
        ]);
    }),
];
