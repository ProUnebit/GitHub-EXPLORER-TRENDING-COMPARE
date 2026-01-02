import type {
    GitHubRepo,
    GitHubSearchResponse,
    GitHubContributor,
} from '@/lib/github/types';

// ============================================
// MOCK DATA для тестов
// ============================================
// Реалистичные данные для моков

export const mockRepo: GitHubRepo = {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    owner: {
        login: 'facebook',
        id: 69631,
        avatar_url: 'https://avatars.githubusercontent.com/u/69631',
        html_url: 'https://github.com/facebook',
        type: 'Organization',
    },
    html_url: 'https://github.com/facebook/react',
    description:
        'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    fork: false,
    created_at: '2013-05-24T16:15:54Z',
    updated_at: '2024-12-30T10:00:00Z',
    pushed_at: '2024-12-30T09:00:00Z',
    stargazers_count: 220000,
    watchers_count: 220000,
    forks_count: 45000,
    open_issues_count: 1200,
    language: 'JavaScript',
    topics: ['react', 'javascript', 'ui', 'frontend'],
    visibility: 'public',
    default_branch: 'main',
    license: {
        key: 'mit',
        name: 'MIT License',
        spdx_id: 'MIT',
        url: 'https://api.github.com/licenses/mit',
    },
};

export const mockRepo2: GitHubRepo = {
    id: 2,
    name: 'vue',
    full_name: 'vuejs/vue',
    owner: {
        login: 'vuejs',
        id: 6128107,
        avatar_url: 'https://avatars.githubusercontent.com/u/6128107',
        html_url: 'https://github.com/vuejs',
        type: 'Organization',
    },
    html_url: 'https://github.com/vuejs/vue',
    description:
        'Vue.js is a progressive, incrementally-adoptable JavaScript framework.',
    fork: false,
    created_at: '2013-07-29T03:24:51Z',
    updated_at: '2024-12-30T10:00:00Z',
    pushed_at: '2024-12-30T09:00:00Z',
    stargazers_count: 205000,
    watchers_count: 205000,
    forks_count: 32000,
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
};

export const mockSearchResponse: GitHubSearchResponse = {
    total_count: 2,
    incomplete_results: false,
    items: [mockRepo, mockRepo2],
};

export const mockSearchResponsePage2: GitHubSearchResponse = {
    total_count: 100,
    incomplete_results: false,
    items: [
        { ...mockRepo, id: 3, name: 'angular' },
        { ...mockRepo, id: 4, name: 'svelte' },
    ],
};

export const mockContributor: GitHubContributor = {
    login: 'gaearon',
    id: 810438,
    avatar_url: 'https://avatars.githubusercontent.com/u/810438',
    html_url: 'https://github.com/gaearon',
    contributions: 1500,
    type: 'User',
};

export const mockContributors: GitHubContributor[] = [
    mockContributor,
    { ...mockContributor, login: 'sophiebits', id: 6820, contributions: 800 },
    { ...mockContributor, login: 'sebmarkbage', id: 63648, contributions: 600 },
];

export const mockLanguages = {
    JavaScript: 5000000,
    TypeScript: 1000000,
    CSS: 500000,
};
