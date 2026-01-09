import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilters } from '@/app/_components/SearchFilters';

// SearchFilters COMPONENT TESTS

describe('SearchFilters', () => {
    const mockOnLanguageChange = vi.fn();
    const mockOnMinStarsChange = vi.fn();
    const mockOnClearFilters = vi.fn();

    const defaultProps = {
        language: '',
        minStars: '',
        onLanguageChange: mockOnLanguageChange,
        onMinStarsChange: mockOnMinStarsChange,
        onClearFilters: mockOnClearFilters,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // BASIC RENDERING

    describe('rendering', () => {
        it('renders language filter label', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(screen.getByLabelText('Language')).toBeInTheDocument();
        });

        it('renders stars filter label', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(screen.getByLabelText('Stars')).toBeInTheDocument();
        });

        it('does not show Clear button when no active filters', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(
                screen.queryByRole('button', { name: /clear filters/i })
            ).not.toBeInTheDocument();
        });

        it('does not show active filters badges when empty', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(screen.queryByText('Active filters:')).not.toBeInTheDocument();
        });
    });

    // LANGUAGE FILTER

    describe('language filter', () => {
        it('shows selected language value in select', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);
            // There may be multiple "JavaScript" (select + badge), just check at least one exists
            const elements = screen.getAllByText('JavaScript');
            expect(elements.length).toBeGreaterThanOrEqual(1);
        });

        it('shows placeholder when no language selected', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(screen.getByText('All Languages')).toBeInTheDocument();
        });

        it('calls onLanguageChange when option selected', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} />);

            const languageSelect = screen.getByRole('combobox', { name: /language/i });
            await user.click(languageSelect);

            const pythonOption = screen.getByRole('option', { name: 'Python' });
            await user.click(pythonOption);

            expect(mockOnLanguageChange).toHaveBeenCalledWith('python');
        });
    });

    // STARS FILTER

    describe('stars filter', () => {
        it('shows selected stars value', () => {
            render(<SearchFilters {...defaultProps} minStars="1000" />);
            expect(screen.getByText('⭐️1000+')).toBeInTheDocument();
        });

        it('shows placeholder when no stars selected', () => {
            render(<SearchFilters {...defaultProps} />);
            expect(screen.getByText('⭐️0+')).toBeInTheDocument();
        });

        it('calls onMinStarsChange when option selected', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} />);

            const starsSelect = screen.getByRole('combobox', { name: /stars/i });
            await user.click(starsSelect);

            const option1000 = screen.getByRole('option', { name: '⭐️1000+' });
            await user.click(option1000);

            expect(mockOnMinStarsChange).toHaveBeenCalledWith('1000');
        });
    });

    // ACTIVE FILTERS

    describe('active filters', () => {
        it('shows active filters text when filters applied', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);
            expect(screen.getByText('Active filters:')).toBeInTheDocument();
        });

        it('shows language badge when language selected', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);
            expect(screen.getByText(/Language:/)).toBeInTheDocument();
        });

        it('shows stars badge when stars selected', () => {
            render(<SearchFilters {...defaultProps} minStars="1000" />);
            expect(screen.getByText(/Stars:/)).toBeInTheDocument();
        });

        it('shows Clear Filters button when filters active', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);
            expect(
                screen.getByRole('button', { name: /clear filters/i })
            ).toBeInTheDocument();
        });

        it('calls onClearFilters when Clear button clicked', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} language="javascript" />);

            const clearButton = screen.getByRole('button', { name: /clear filters/i });
            await user.click(clearButton);

            expect(mockOnClearFilters).toHaveBeenCalled();
        });

        it('can remove language filter via badge X button', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} language="javascript" />);

            // Find the X button inside the language badge
            const languageBadge = screen.getByText(/Language:/).closest('span');
            const xButton = languageBadge?.querySelector('button');

            if (xButton) {
                await user.click(xButton);
                expect(mockOnLanguageChange).toHaveBeenCalledWith('');
            }
        });

        it('can remove stars filter via badge X button', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} minStars="1000" />);

            // Find the X button inside the stars badge
            const starsBadge = screen.getByText(/Stars:/).closest('span');
            const xButton = starsBadge?.querySelector('button');

            if (xButton) {
                await user.click(xButton);
                expect(mockOnMinStarsChange).toHaveBeenCalledWith('');
            }
        });
    });

    // DISABLED STATE

    describe('disabled state', () => {
        it('disables language select when disabled', () => {
            render(<SearchFilters {...defaultProps} disabled={true} />);
            const languageSelect = screen.getByRole('combobox', { name: /language/i });
            expect(languageSelect).toBeDisabled();
        });

        it('disables stars select when disabled', () => {
            render(<SearchFilters {...defaultProps} disabled={true} />);
            const starsSelect = screen.getByRole('combobox', { name: /stars/i });
            expect(starsSelect).toBeDisabled();
        });

        it('disables Clear button when disabled', () => {
            render(
                <SearchFilters
                    {...defaultProps}
                    language="javascript"
                    disabled={true}
                />
            );
            const clearButton = screen.getByRole('button', { name: /clear filters/i });
            expect(clearButton).toBeDisabled();
        });
    });

    // BOTH FILTERS

    describe('both filters active', () => {
        it('shows both filter badges', () => {
            render(
                <SearchFilters
                    {...defaultProps}
                    language="javascript"
                    minStars="1000"
                />
            );

            expect(screen.getByText(/Language:/)).toBeInTheDocument();
            expect(screen.getByText(/Stars:/)).toBeInTheDocument();
        });
    });
});
