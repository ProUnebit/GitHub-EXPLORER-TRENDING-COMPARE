import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoCard } from '@/app/_components/RepoCard';
import { mockRepo, mockRepoNoDescription, mockRepoManyTopics } from '@/tests/mocks/fixtures';

// RepoCard COMPONENT TESTS

describe('RepoCard', () => {

    // BASIC RENDERING

    describe('basic rendering', () => {
        it('renders repository name in heading', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(screen.getByRole('heading', { name: 'react' })).toBeInTheDocument();
        });

        it('renders repository owner', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(screen.getByText('facebook')).toBeInTheDocument();
        });

        it('renders description', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(
                screen.getByText(/library for web and native user interfaces/i)
            ).toBeInTheDocument();
        });

        it('renders "No description available" when description is null', () => {
            render(<RepoCard repo={mockRepoNoDescription} />);
            expect(screen.getByText('No description available')).toBeInTheDocument();
        });
    });

    // STATISTICS

    describe('statistics', () => {
        it('renders formatted star count', () => {
            render(<RepoCard repo={mockRepo} />);
            // 220000 -> 220.0k
            expect(screen.getByText('220.0k')).toBeInTheDocument();
        });

        it('renders formatted fork count', () => {
            render(<RepoCard repo={mockRepo} />);
            // 45000 -> 45.0k
            expect(screen.getByText('45.0k')).toBeInTheDocument();
        });

        it('renders license when present', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(screen.getByText('MIT')).toBeInTheDocument();
        });

        it('does not render license when absent', () => {
            render(<RepoCard repo={mockRepoNoDescription} />);
            expect(screen.queryByText('MIT')).not.toBeInTheDocument();
        });
    });

    // LANGUAGE

    describe('language', () => {
        it('renders language when present', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(screen.getByText('JavaScript')).toBeInTheDocument();
        });

        it('does not render language section when null', () => {
            render(<RepoCard repo={mockRepoNoDescription} />);
            expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
        });
    });

    // TOPICS

    describe('topics', () => {
        it('renders topic badges', () => {
            render(<RepoCard repo={mockRepo} />);
            // mockRepo has topics: ['react', 'javascript', 'frontend', 'ui', 'declarative']
            // 'react' appears twice (heading + topic badge), so check for multiple elements
            const reactElements = screen.getAllByText('react');
            expect(reactElements.length).toBeGreaterThanOrEqual(2);
            expect(screen.getByText('javascript')).toBeInTheDocument();
            expect(screen.getByText('frontend')).toBeInTheDocument();
        });

        it('shows overflow indicator for more than 3 topics', () => {
            render(<RepoCard repo={mockRepo} />);
            // mockRepo has 5 topics, showing 3 + "+2"
            expect(screen.getByText('+2')).toBeInTheDocument();
        });

        it('shows correct overflow count', () => {
            render(<RepoCard repo={mockRepoManyTopics} />);
            // mockRepoManyTopics has 6 topics, showing 3 + "+3"
            expect(screen.getByText('+3')).toBeInTheDocument();
        });

        it('does not render topics section when empty', () => {
            render(<RepoCard repo={mockRepoNoDescription} />);
            // No topic badges should be present
            expect(screen.queryByText('+1')).not.toBeInTheDocument();
        });
    });

    // NAVIGATION

    describe('navigation', () => {
        it('renders link to repository detail page', () => {
            render(<RepoCard repo={mockRepo} />);
            const link = screen.getByRole('link', { name: 'react' });
            expect(link).toHaveAttribute('href', '/repo/facebook/react');
        });

        it('link is an anchor element', () => {
            render(<RepoCard repo={mockRepo} />);
            const link = screen.getByRole('link', { name: 'react' });
            expect(link.tagName).toBe('A');
        });
    });

    // RELATIVE TIME

    describe('relative time', () => {
        it('renders updated time', () => {
            render(<RepoCard repo={mockRepo} />);
            expect(screen.getByText(/Updated/i)).toBeInTheDocument();
        });
    });

    // HEALTH BADGE

    describe('health badge', () => {
        it('renders health badge component', () => {
            render(<RepoCard repo={mockRepo} />);
            // Health badge shows score
            expect(screen.getByTitle(/Health Score/i)).toBeInTheDocument();
        });
    });
});
