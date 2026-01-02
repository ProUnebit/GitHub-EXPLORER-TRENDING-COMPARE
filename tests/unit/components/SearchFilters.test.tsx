import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilters } from '@/app/_components/SearchFilters';

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

    describe('Rendering', () => {
        it('renders language and stars filters', () => {
            render(<SearchFilters {...defaultProps} />);

            expect(screen.getByLabelText('Language')).toBeInTheDocument();
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

            expect(
                screen.queryByText('Active filters:')
            ).not.toBeInTheDocument();
        });
    });

    describe('Language Filter', () => {
        it('shows selected language', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);

            expect(screen.getByText('JavaScript')).toBeInTheDocument();
        });

        it('calls onLanguageChange when changed', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} />);

            const languageSelect = screen.getByRole('combobox', {
                name: /language/i,
            });
            await user.click(languageSelect);

            const pythonOption = screen.getByRole('option', { name: 'Python' });
            await user.click(pythonOption);

            expect(mockOnLanguageChange).toHaveBeenCalledWith('python');
        });
    });

    describe('Stars Filter', () => {
        it('shows selected stars value', () => {
            render(<SearchFilters {...defaultProps} minStars="1000" />);

            expect(screen.getByText('⭐️1000+')).toBeInTheDocument();
        });

        it('calls onMinStarsChange when changed', async () => {
            const user = userEvent.setup();
            render(<SearchFilters {...defaultProps} />);

            const starsSelect = screen.getByRole('combobox', {
                name: /stars/i,
            });
            await user.click(starsSelect);

            const option1000 = screen.getByRole('option', { name: '⭐️1000+' });
            await user.click(option1000);

            expect(mockOnMinStarsChange).toHaveBeenCalledWith('1000');
        });
    });

    describe('Active Filters', () => {
        it('shows active filters badges', () => {
            render(
                <SearchFilters
                    {...defaultProps}
                    language="javascript"
                    minStars="1000"
                />
            );

            expect(screen.getByText('Active filters:')).toBeInTheDocument();
            expect(screen.getByText(/Language:/)).toBeInTheDocument();
            expect(screen.getByText(/Stars:/)).toBeInTheDocument();
        });

        it('shows Clear Filters button when filters active', () => {
            render(<SearchFilters {...defaultProps} language="javascript" />);

            expect(
                screen.getByRole('button', { name: /clear filters/i })
            ).toBeInTheDocument();
        });

        it('can remove individual filter via badge X', async () => {
            const user = userEvent.setup();
            render(
                <SearchFilters
                    {...defaultProps}
                    language="javascript"
                    minStars="1000"
                />
            );

            // Находим X кнопку в badge языка
            const badges = screen.getAllByRole('button');
            const languageBadgeX = badges.find((btn) =>
                btn.parentElement?.textContent?.includes('Language')
            );

            if (languageBadgeX) {
                await user.click(languageBadgeX);
                expect(mockOnLanguageChange).toHaveBeenCalledWith('');
            }
        });

        it('clears all filters via Clear button', async () => {
            const user = userEvent.setup();
            render(
                <SearchFilters
                    {...defaultProps}
                    language="javascript"
                    minStars="1000"
                />
            );

            const clearButton = screen.getByRole('button', {
                name: /clear filters/i,
            });
            await user.click(clearButton);

            expect(mockOnClearFilters).toHaveBeenCalled();
        });
    });

    describe('Disabled State', () => {
        it('disables all controls when disabled prop is true', () => {
            render(<SearchFilters {...defaultProps} disabled={true} />);

            const languageSelect = screen.getByRole('combobox', {
                name: /language/i,
            });
            const starsSelect = screen.getByRole('combobox', {
                name: /stars/i,
            });

            expect(languageSelect).toBeDisabled();
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

            const clearButton = screen.getByRole('button', {
                name: /clear filters/i,
            });
            expect(clearButton).toBeDisabled();
        });
    });
});
