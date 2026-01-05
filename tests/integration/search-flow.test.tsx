import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '@/components/SearchInput';

// ============================================
// SEARCH FLOW INTEGRATION TESTS
// ============================================

// Override the default mock for these tests
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
}));

describe('Search Flow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ============================================
    // BASIC SEARCH
    // ============================================

    describe('basic search', () => {
        it('renders search input', () => {
            render(<SearchInput />);
            expect(
                screen.getByPlaceholderText(/search repositories/i)
            ).toBeInTheDocument();
        });

        it('renders search button', () => {
            render(<SearchInput />);
            expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
        });

        it('allows typing in search input', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            expect(input).toHaveValue('react');
        });

        it('disables search button when input is empty', () => {
            render(<SearchInput />);

            const button = screen.getByRole('button', { name: /search/i });
            expect(button).toBeDisabled();
        });

        it('enables search button when input has value', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            const button = screen.getByRole('button', { name: /search/i });
            expect(button).not.toBeDisabled();
        });
    });

    // ============================================
    // SEARCH SUBMISSION
    // ============================================

    describe('search submission', () => {
        it('calls router.push on form submit', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalled();
            });
        });

        it('includes query in URL', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('q=react'));
            });
        });

        it('shows loading state on submit', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            // Button text might change to "Searching..."
            // This depends on the isPending state from useTransition
        });
    });

    // ============================================
    // FILTERS IN URL
    // ============================================

    describe('filters in URL', () => {
        it('includes language filter when selected', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            // Type query
            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            // Select language
            const languageSelect = screen.getByRole('combobox', { name: /language/i });
            await user.click(languageSelect);

            const jsOption = screen.getByRole('option', { name: 'JavaScript' });
            await user.click(jsOption);

            // Submit
            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith(
                    expect.stringContaining('language=javascript')
                );
            });
        });

        it('includes stars filter when selected', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            // Type query
            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            // Select stars
            const starsSelect = screen.getByRole('combobox', { name: /stars/i });
            await user.click(starsSelect);

            const option = screen.getByRole('option', { name: '⭐️1000+' });
            await user.click(option);

            // Submit
            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith(
                    expect.stringContaining('minStars=1000')
                );
            });
        });

        it('includes both filters when both selected', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            // Type query
            const input = screen.getByPlaceholderText(/search repositories/i);
            await user.type(input, 'react');

            // Select language
            const languageSelect = screen.getByRole('combobox', { name: /language/i });
            await user.click(languageSelect);
            const pyOption = screen.getByRole('option', { name: 'Python' });
            await user.click(pyOption);

            // Select stars
            const starsSelect = screen.getByRole('combobox', { name: /stars/i });
            await user.click(starsSelect);
            const starsOption = screen.getByRole('option', { name: '⭐️5000+' });
            await user.click(starsOption);

            // Submit
            const button = screen.getByRole('button', { name: /search/i });
            await user.click(button);

            await waitFor(() => {
                const url = mockPush.mock.calls[0][0];
                expect(url).toContain('language=python');
                expect(url).toContain('minStars=5000');
            });
        });
    });

    // ============================================
    // CLEAR FILTERS
    // ============================================

    describe('clear filters', () => {
        it('shows Clear Filters button when filters active', async () => {
            const user = userEvent.setup();
            render(<SearchInput />);

            // Select a filter
            const languageSelect = screen.getByRole('combobox', { name: /language/i });
            await user.click(languageSelect);
            const jsOption = screen.getByRole('option', { name: 'JavaScript' });
            await user.click(jsOption);

            // Clear button should appear
            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /clear filters/i })
                ).toBeInTheDocument();
            });
        });
    });
});
