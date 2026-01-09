// GitHub API Response Types
export interface GitHubRepo {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    has_wiki?: any;
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

// Dependency Analysis Types
export type PackageJson = {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
};

export type DependencyInfo = {
    name: string;
    version: string;
    type: 'production' | 'development' | 'peer' | 'optional';
};


// ISSUES TYPES

export interface GitHubIssue {
    id: number;
    number: number;
    title: string;
    state: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    comments: number;
    html_url: string;
    user: GitHubUser;
    labels: GitHubLabel[];
    reactions: {
        total_count: number;
        '+1': number;
        '-1': number;
        laugh: number;
        hooray: number;
        confused: number;
        heart: number;
        rocket: number;
        eyes: number;
    };
    body: string | null;
}

export interface GitHubLabel {
    id: number;
    name: string;
    color: string;
    description: string | null;
}

// Аналитика по Issues
export interface IssuesAnalytics {
    total: number;
    open: number;
    closed: number;
    avgCloseTime: number; // в днях
    avgResponseTime: number; // в часах
    topLabels: LabelStats[];
    topContributors: IssueContributor[];
    hottestIssues: GitHubIssue[];
    timeline: IssueTimelineData[];
}

export interface LabelStats {
    name: string;
    color: string;
    count: number;
    percentage: number;
}

export interface IssueContributor {
    user: GitHubUser;
    issuesClosed: number;
    commentsCount: number;
}

export interface IssueTimelineData {
    date: string; // YYYY-MM format
    open: number;
    closed: number;
}
