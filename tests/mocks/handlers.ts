import { http, HttpResponse } from 'msw';
import {
    mockRepo,
    mockRepo2,
    mockSearchResponse,
    mockSearchResponseEmpty,
    mockSearchResponsePage2,
    mockContributors,
    mockLanguages,
    mockCommits,
    mockPackageJson,
} from './fixtures';

const GITHUB_API = 'https://api.github.com';

// ============================================
// MSW HANDLERS
// ============================================

export const handlers = [
    // ============================================
    // SEARCH REPOSITORIES
    // ============================================
    http.get(`${GITHUB_API}/search/repositories`, ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q') || '';
        const page = url.searchParams.get('page') || '1';

        // Error simulation
        if (query.includes('error')) {
            return HttpResponse.json(
                { message: 'API rate limit exceeded' },
                { status: 403 }
            );
        }

        // Not found simulation
        if (query.includes('notfound') || query.includes('nonexistent')) {
            return HttpResponse.json(mockSearchResponseEmpty);
        }

        // Pagination
        if (page === '2') {
            return HttpResponse.json(mockSearchResponsePage2);
        }

        return HttpResponse.json(mockSearchResponse);
    }),

    // ============================================
    // GET SINGLE REPOSITORY
    // ============================================
    http.get(`${GITHUB_API}/repos/:owner/:repo`, ({ params }) => {
        const { owner, repo } = params;

        if (repo === 'notfound' || owner === 'notfound') {
            return HttpResponse.json(
                { message: 'Not Found' },
                { status: 404 }
            );
        }

        if (owner === 'error') {
            return HttpResponse.json(
                { message: 'Server Error' },
                { status: 500 }
            );
        }

        if (owner === 'facebook' && repo === 'react') {
            return HttpResponse.json(mockRepo);
        }

        if (owner === 'vuejs' && repo === 'vue') {
            return HttpResponse.json(mockRepo2);
        }

        // Default response
        return HttpResponse.json({
            ...mockRepo,
            name: repo as string,
            full_name: `${owner}/${repo}`,
            owner: {
                ...mockRepo.owner,
                login: owner as string,
            },
        });
    }),

    // ============================================
    // GET CONTRIBUTORS
    // ============================================
    http.get(`${GITHUB_API}/repos/:owner/:repo/contributors`, ({ params, request }) => {
        const { owner } = params;
        const url = new URL(request.url);
        const perPage = parseInt(url.searchParams.get('per_page') || '10');

        if (owner === 'notfound') {
            return HttpResponse.json(
                { message: 'Not Found' },
                { status: 404 }
            );
        }

        return HttpResponse.json(mockContributors.slice(0, perPage));
    }),

    // ============================================
    // GET LANGUAGES
    // ============================================
    http.get(`${GITHUB_API}/repos/:owner/:repo/languages`, ({ params }) => {
        const { owner } = params;

        if (owner === 'notfound') {
            return HttpResponse.json(
                { message: 'Not Found' },
                { status: 404 }
            );
        }

        return HttpResponse.json(mockLanguages);
    }),

    // ============================================
    // GET COMMITS
    // ============================================
    http.get(`${GITHUB_API}/repos/:owner/:repo/commits`, ({ params, request }) => {
        const { owner } = params;
        const url = new URL(request.url);
        const perPage = parseInt(url.searchParams.get('per_page') || '10');

        if (owner === 'notfound') {
            return HttpResponse.json(
                { message: 'Not Found' },
                { status: 404 }
            );
        }

        return HttpResponse.json(mockCommits.slice(0, perPage));
    }),

    // ============================================
    // GET FILE CONTENTS (for package.json)
    // ============================================
    http.get(`${GITHUB_API}/repos/:owner/:repo/contents/:path`, ({ params }) => {
        const { owner, path } = params;

        if (owner === 'notfound') {
            return HttpResponse.json(
                { message: 'Not Found' },
                { status: 404 }
            );
        }

        if (path === 'package.json') {
            const content = Buffer.from(JSON.stringify(mockPackageJson)).toString('base64');
            return HttpResponse.json({
                name: 'package.json',
                path: 'package.json',
                content,
                encoding: 'base64',
            });
        }

        return HttpResponse.json(
            { message: 'Not Found' },
            { status: 404 }
        );
    }),
];

// ============================================
// ERROR HANDLERS (for specific test cases)
// ============================================

export const errorHandlers = {
    searchRateLimit: http.get(`${GITHUB_API}/search/repositories`, () => {
        return HttpResponse.json(
            { message: 'API rate limit exceeded' },
            { status: 403 }
        );
    }),

    searchServerError: http.get(`${GITHUB_API}/search/repositories`, () => {
        return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }),

    repoNotFound: http.get(`${GITHUB_API}/repos/:owner/:repo`, () => {
        return HttpResponse.json(
            { message: 'Not Found' },
            { status: 404 }
        );
    }),

    networkError: http.get(`${GITHUB_API}/search/repositories`, () => {
        return HttpResponse.error();
    }),
};
