import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoCard } from '@/app/_components/RepoCard';
import { mockRepo, mockRepo2 } from '@/tests/mocks/fixtures';


// NAVIGATION INTEGRATION TESTS


describe('Navigation Integration', () => {

    // REPOSITORY CARD NAVIGATION


    describe('repository card navigation', () => {
        it('repo card links to correct detail page', () => {
            render(<RepoCard repo={mockRepo} />);

            const link = screen.getByRole('link', { name: 'react' });
            expect(link).toHaveAttribute('href', '/repo/facebook/react');
        });

        it('repo card link is an anchor element', () => {
            render(<RepoCard repo={mockRepo} />);

            const link = screen.getByRole('link', { name: 'react' });
            expect(link.tagName).toBe('A');
        });

        it('different repos link to different pages', () => {
            const { rerender } = render(<RepoCard repo={mockRepo} />);
            let link = screen.getByRole('link', { name: 'react' });
            expect(link).toHaveAttribute('href', '/repo/facebook/react');

            rerender(<RepoCard repo={mockRepo2} />);
            link = screen.getByRole('link', { name: 'vue' });
            expect(link).toHaveAttribute('href', '/repo/vuejs/vue');
        });
    });


    // MULTIPLE CARDS


    describe('multiple cards', () => {
        it('renders multiple cards with correct links', () => {
            render(
                <>
                    <RepoCard repo={mockRepo} />
                    <RepoCard repo={mockRepo2} />
                </>
            );

            const reactLink = screen.getByRole('link', { name: 'react' });
            const vueLink = screen.getByRole('link', { name: 'vue' });

            expect(reactLink).toHaveAttribute('href', '/repo/facebook/react');
            expect(vueLink).toHaveAttribute('href', '/repo/vuejs/vue');
        });
    });


    // URL STRUCTURE


    describe('URL structure', () => {
        it('uses correct URL format: /repo/owner/name', () => {
            render(<RepoCard repo={mockRepo} />);

            const link = screen.getByRole('link', { name: 'react' });
            const href = link.getAttribute('href');

            // Should match pattern /repo/{owner}/{repo}
            expect(href).toMatch(/^\/repo\/[^/]+\/[^/]+$/);
        });

        it('handles special characters in repo names', () => {
            const specialRepo = {
                ...mockRepo,
                name: 'next.js',
                full_name: 'vercel/next.js',
                owner: { ...mockRepo.owner, login: 'vercel' },
            };

            render(<RepoCard repo={specialRepo} />);

            const link = screen.getByRole('link', { name: 'next.js' });
            expect(link).toHaveAttribute('href', '/repo/vercel/next.js');
        });
    });
});
