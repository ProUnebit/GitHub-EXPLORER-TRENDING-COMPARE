import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
    GitHubLanguages,
    GitHubCommit,
} from '@/lib/github/types';

// ============================================
// MOCK REPOSITORIES
// ============================================

export const mockRepo: GitHubRepo = {
    id: 10270250,
    name: 'react',
    full_name: 'facebook/react',
    owner: {
        login: 'facebook',
        id: 69631,
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        html_url: 'https://github.com/facebook',
        type: 'Organization',
    },
    html_url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces.',
    fork: false,
    created_at: '2013-05-24T16:15:54Z',
    updated_at: new Date().toISOString(), // Recent update for active score
    pushed_at: new Date().toISOString(),
    stargazers_count: 220000,
    watchers_count: 220000,
    forks_count: 45000,
    open_issues_count: 1500,
    language: 'JavaScript',
    topics: ['react', 'javascript', 'frontend', 'ui', 'declarative'],
    visibility: 'public',
    default_branch: 'main',
    license: {
        key: 'mit',
        name: 'MIT License',
        spdx_id: 'MIT',
        url: 'https://api.github.com/licenses/mit',
    },
    has_wiki: true,
};

export const mockRepo2: GitHubRepo = {
    id: 11730342,
    name: 'vue',
    full_name: 'vuejs/vue',
    owner: {
        login: 'vuejs',
        id: 6128107,
        avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
        html_url: 'https://github.com/vuejs',
        type: 'Organization',
    },
    html_url: 'https://github.com/vuejs/vue',
    description: 'This is the repo for Vue 2. For Vue 3, go to vuejs/core',
    fork: false,
    created_at: '2013-07-29T03:24:51Z',
    updated_at: '2024-01-15T10:30:00Z', // Older update
    pushed_at: '2024-01-15T10:30:00Z',
    stargazers_count: 206000,
    watchers_count: 206000,
    forks_count: 33000,
    open_issues_count: 500,
    language: 'TypeScript',
    topics: ['vue', 'javascript', 'framework'],
    visibility: 'public',
    default_branch: 'main',
    license: {
        key: 'mit',
        name: 'MIT License',
        spdx_id: 'MIT',
        url: 'https://api.github.com/licenses/mit',
    },
    has_wiki: false,
};

export const mockRepoNoDescription: GitHubRepo = {
    ...mockRepo,
    id: 99999,
    name: 'test-repo',
    full_name: 'test/test-repo',
    description: null,
    language: null,
    license: null,
    topics: [],
    has_wiki: false,
};

export const mockRepoManyTopics: GitHubRepo = {
    ...mockRepo,
    id: 88888,
    name: 'multi-topic',
    full_name: 'test/multi-topic',
    topics: ['react', 'typescript', 'nextjs', 'tailwind', 'testing', 'ci-cd'],
};

export const mockRepoAbandoned: GitHubRepo = {
    ...mockRepo,
    id: 77777,
    name: 'abandoned-repo',
    full_name: 'old/abandoned-repo',
    updated_at: '2020-01-01T00:00:00Z', // Very old
    stargazers_count: 50,
    forks_count: 5,
    open_issues_count: 100, // Many issues relative to stars
    has_wiki: false,
    license: null,
    description: null,
};

// Repo with medium activity (30-90 days old)
export const mockRepoMediumActivity: GitHubRepo = {
    ...mockRepo,
    id: 66666,
    name: 'medium-activity',
    full_name: 'test/medium-activity',
    updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
};

// ============================================
// MOCK SEARCH RESPONSES
// ============================================

export const mockSearchResponse: GitHubSearchResponse = {
    total_count: 100,
    incomplete_results: false,
    items: [mockRepo, mockRepo2],
};

export const mockSearchResponseEmpty: GitHubSearchResponse = {
    total_count: 0,
    incomplete_results: false,
    items: [],
};

export const mockSearchResponsePage2: GitHubSearchResponse = {
    total_count: 100,
    incomplete_results: false,
    items: [
        { ...mockRepo, id: 3, name: 'angular', full_name: 'angular/angular' },
        { ...mockRepo, id: 4, name: 'svelte', full_name: 'sveltejs/svelte' },
    ],
};

export function createPaginatedResponse(page: number, perPage: number = 30): GitHubSearchResponse {
    const totalCount = 100;
    const startIndex = (page - 1) * perPage;
    const items = Array.from(
        { length: Math.min(perPage, totalCount - startIndex) },
        (_, i) => ({
            ...mockRepo,
            id: startIndex + i + 1,
            name: `repo-${startIndex + i + 1}`,
            full_name: `owner/repo-${startIndex + i + 1}`,
        })
    );

    return {
        total_count: totalCount,
        incomplete_results: false,
        items,
    };
}

// ============================================
// MOCK CONTRIBUTORS
// ============================================

export const mockContributors: GitHubContributor[] = [
    {
        login: 'gaearon',
        id: 810438,
        avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
        html_url: 'https://github.com/gaearon',
        contributions: 2500,
        type: 'User',
    },
    {
        login: 'sophiebits',
        id: 6820,
        avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4',
        html_url: 'https://github.com/sophiebits',
        contributions: 2000,
        type: 'User',
    },
    {
        login: 'acdlite',
        id: 3624098,
        avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4',
        html_url: 'https://github.com/acdlite',
        contributions: 1500,
        type: 'User',
    },
];

// ============================================
// MOCK LANGUAGES
// ============================================

export const mockLanguages: GitHubLanguages = {
    JavaScript: 5000000,
    TypeScript: 2000000,
    HTML: 500000,
    CSS: 300000,
};

// ============================================
// MOCK COMMITS
// ============================================

export const mockCommits: GitHubCommit[] = [
    {
        sha: 'abc123def456',
        commit: {
            author: {
                name: 'Dan Abramov',
                email: 'dan@example.com',
                date: new Date().toISOString(),
            },
            message: 'Fix critical bug in reconciler',
        },
        html_url: 'https://github.com/facebook/react/commit/abc123def456',
        author: {
            login: 'gaearon',
            id: 810438,
            avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
            html_url: 'https://github.com/gaearon',
            type: 'User',
        },
    },
    {
        sha: 'def789ghi012',
        commit: {
            author: {
                name: 'Sophie Alpert',
                email: 'sophie@example.com',
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            },
            message: 'Update dependencies',
        },
        html_url: 'https://github.com/facebook/react/commit/def789ghi012',
        author: {
            login: 'sophiebits',
            id: 6820,
            avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4',
            html_url: 'https://github.com/sophiebits',
            type: 'User',
        },
    },
];

// ============================================
// MOCK PACKAGE.JSON
// ============================================

export const mockPackageJson = {
    name: 'react',
    version: '19.0.0',
    dependencies: {
        'loose-envify': '^1.1.0',
    },
    devDependencies: {
        '@babel/core': '^7.23.0',
        typescript: '^5.0.0',
        jest: '^29.0.0',
        prettier: '^3.0.0',
    },
    peerDependencies: {
        'react-dom': '^19.0.0',
    },
};
