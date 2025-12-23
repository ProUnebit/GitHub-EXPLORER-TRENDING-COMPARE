// GitHub API Response Types
export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    owner: GitHubUser;
    html_url: string;
    description: string | null;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    topics: string[];
    visibility: string;
    default_branch: string;
    license: GitHubLicense | null;
}

export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
}

export interface GitHubLicense {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
}

export interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepo[];
}

export interface GitHubContributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
    type: string;
}

export interface GitHubLanguages {
    [language: string]: number;
}

export interface GitHubCommit {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
    };
    html_url: string;
    author: GitHubUser | null;
}

// Application Types
export interface RepoCardProps {
    repo: GitHubRepo;
}

export interface SearchParams {
    q: string;
    sort?: 'stars' | 'forks' | 'updated';
    order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}
