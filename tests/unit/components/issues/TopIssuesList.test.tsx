// tests/unit/components/issues/TopIssuesList.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopIssuesList } from '@/app/repo/[owner]/[name]/_components/TopIssuesList';
import type { GitHubIssue } from '@/lib/github/types';

describe('TopIssuesList', () => {
    const mockIssues: GitHubIssue[] = [
        {
            id: 1, number: 101, title: 'First hottest issue', state: 'open',
            created_at: '2024-12-01T00:00:00Z', closed_at: null,
            html_url: 'https://github.com/test/repo/issues/101',
            user: { login: 'user1', avatar_url: 'https://avatar.url/user1' },
            labels: [{ id: 1, name: 'bug', color: 'd73a4a', description: 'Bug' }],
            comments: 50, reactions: { total_count: 30 }
        }
    ];

    it('should render all issues', () => {
        render(<TopIssuesList issues={mockIssues} />);
        // The title is rendered as: #{issue.number} {issue.title}
        // So we look for the title text
        expect(screen.getByText(/First hottest issue/)).toBeInTheDocument();
    });

    it('should display rank badges', () => {
        render(<TopIssuesList issues={mockIssues} />);
        // Component renders {index + 1} without # for rank badge
        // The rank is just "1" in a div, not "#1"
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should display comment and reaction counts', () => {
        render(<TopIssuesList issues={mockIssues} />);
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should render labels with colors', () => {
        render(<TopIssuesList issues={mockIssues} />);
        expect(screen.getByText('bug')).toBeInTheDocument();
        const bugLabel = screen.getByText('bug').closest('span');
        expect(bugLabel?.style.backgroundColor).toBeTruthy();
    });

    it('should show empty state when no issues', () => {
        render(<TopIssuesList issues={[]} />);
        expect(screen.getByText('No issues found')).toBeInTheDocument();
    });

    it('should render issue number with hash in link', () => {
        render(<TopIssuesList issues={mockIssues} />);
        // The component renders: #{issue.number} {issue.title}
        expect(screen.getByText(/#101 First hottest issue/)).toBeInTheDocument();
    });

    it('should render issue state badge', () => {
        render(<TopIssuesList issues={mockIssues} />);
        expect(screen.getByText('open')).toBeInTheDocument();
    });
});
