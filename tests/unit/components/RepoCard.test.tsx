import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoCard } from '@/app/_components/RepoCard';
import { mockRepo } from '@/tests/mocks/fixtures';

describe('RepoCard', () => {
    it('renders repository name', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('renders repository owner', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(screen.getByText('facebook')).toBeInTheDocument();
    });

    it('renders description', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(
            screen.getByText(/declarative, efficient, and flexible/i)
        ).toBeInTheDocument();
    });

    it('renders "No description" when description is null', () => {
        const repoWithoutDesc = { ...mockRepo, description: null };
        render(<RepoCard repo={repoWithoutDesc} />);

        expect(
            screen.getByText('No description available')
        ).toBeInTheDocument();
    });

    it('renders statistics (stars, forks)', () => {
        render(<RepoCard repo={mockRepo} />);

        // formatNumber форматирует в 220K
        expect(screen.getByText('220K')).toBeInTheDocument(); // Stars
        expect(screen.getByText('45K')).toBeInTheDocument(); // Forks
    });

    it('renders language if present', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('does not render language section if null', () => {
        const repoWithoutLang = { ...mockRepo, language: null };
        render(<RepoCard repo={repoWithoutLang} />);

        expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    });

    it('renders license if present', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(screen.getByText('MIT')).toBeInTheDocument();
    });

    it('renders topics (up to 3)', () => {
        render(<RepoCard repo={mockRepo} />);

        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('javascript')).toBeInTheDocument();
        expect(screen.getByText('ui')).toBeInTheDocument();
    });

    it('shows "+N" badge when more than 3 topics', () => {
        render(<RepoCard repo={mockRepo} />);

        // У mockRepo 4 топика, показываем первые 3 + "+1"
        expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('renders link to repository detail page', () => {
        render(<RepoCard repo={mockRepo} />);

        const link = screen.getByRole('link', { name: 'react' });
        expect(link).toHaveAttribute('href', '/repo/facebook/react');
    });

    it('renders relative time for updated_at', () => {
        render(<RepoCard repo={mockRepo} />);

        // formatRelativeTime форматирует дату
        expect(screen.getByText(/Updated/i)).toBeInTheDocument();
    });
});
