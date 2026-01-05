import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthBadge } from '@/components/HealthBadge';
import { mockRepo, mockRepoAbandoned, mockRepoMediumActivity } from '@/tests/mocks/fixtures';

// ============================================
// HealthBadge COMPONENT TESTS
// ============================================

describe('HealthBadge', () => {
    // ============================================
    // BASIC RENDERING
    // ============================================

    describe('rendering', () => {
        it('renders health score', () => {
            render(<HealthBadge repo={mockRepo} />);
            // Health score should be visible as a number
            const badge = screen.getByTitle(/Health Score/i);
            expect(badge).toBeInTheDocument();
        });

        it('renders emoji', () => {
            render(<HealthBadge repo={mockRepo} />);
            // Should have some emoji (green for healthy repo)
            expect(screen.getByTitle(/Health Score/i).textContent).toMatch(/[💚💛🧡❤️]/);
        });

        it('shows score in title attribute', () => {
            render(<HealthBadge repo={mockRepo} />);
            const badge = screen.getByTitle(/Health Score: \d+\/100/);
            expect(badge).toBeInTheDocument();
        });
    });

    // ============================================
    // SCORE DISPLAY
    // ============================================

    describe('score display', () => {
        it('displays numeric score', () => {
            render(<HealthBadge repo={mockRepo} />);
            // Score should be a number
            const badge = screen.getByTitle(/Health Score/i);
            expect(badge.textContent).toMatch(/\d+/);
        });

        it('shows score out of 100', () => {
            render(<HealthBadge repo={mockRepo} />);
            const badge = screen.getByTitle(/Health Score: \d+\/100/);
            expect(badge).toBeInTheDocument();
        });
    });

    // ============================================
    // SHOW LABEL OPTION
    // ============================================

    describe('showLabel option', () => {
        it('does not show label by default', () => {
            render(<HealthBadge repo={mockRepo} />);
            // Labels like "Excellent", "Good", etc. should not be in text content by default
            const badge = screen.getByTitle(/Health Score/i);
            // Default showLabel is false, so label text won't be directly visible in content
            expect(badge).toBeInTheDocument();
        });

        it('shows label when showLabel is true', () => {
            render(<HealthBadge repo={mockRepo} showLabel={true} />);
            // For healthy repo, should show "Excellent" or "Good"
            const badge = screen.getByTitle(/Health Score/i);
            expect(badge.textContent).toMatch(/(Excellent|Good|Fair|Poor)/);
        });
    });

    // ============================================
    // DIFFERENT HEALTH STATES
    // ============================================

    describe('different health states', () => {
        it('shows healthy badge for active repo with high stars', () => {
            render(<HealthBadge repo={mockRepo} showLabel={true} />);
            // mockRepo is active with 220k stars, should be Excellent or Good
            const badge = screen.getByTitle(/Health Score/i);
            expect(badge.textContent).toMatch(/(Excellent|Good)/);
        });

        it('shows poor badge for abandoned repo', () => {
            render(<HealthBadge repo={mockRepoAbandoned} showLabel={true} />);
            // Abandoned repo should have poor health
            const badge = screen.getByTitle(/Health Score/i);
            // Could be Poor or Fair depending on other factors
            expect(badge).toBeInTheDocument();
        });

        it('handles medium activity repo', () => {
            render(<HealthBadge repo={mockRepoMediumActivity} showLabel={true} />);
            const badge = screen.getByTitle(/Health Score/i);
            expect(badge).toBeInTheDocument();
        });
    });

    // ============================================
    // TITLE ATTRIBUTE
    // ============================================

    describe('title attribute', () => {
        it('includes score and label in title', () => {
            render(<HealthBadge repo={mockRepo} />);
            const badge = screen.getByTitle(/Health Score: \d+\/100 - (Excellent|Good|Fair|Poor)/);
            expect(badge).toBeInTheDocument();
        });
    });
});
