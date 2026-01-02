import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '@/components/SearchInput';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        back: vi.fn(),
        forward: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams('q=react'),
}));

describe('Filters Application Flow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('applies language filter to search', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Query уже есть (из mock useSearchParams)
        expect(screen.getByDisplayValue('react')).toBeInTheDocument();

        // Выбираем язык
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);

        const jsOption = screen.getByRole('option', { name: 'JavaScript' });
        await user.click(jsOption);

        // Submit
        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        // Проверяем что router.push вызван с фильтром
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                expect.stringContaining('language=javascript')
            );
        });
    });

    it('applies stars filter to search', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Выбираем stars
        const starsSelect = screen.getByRole('combobox', { name: /stars/i });
        await user.click(starsSelect);

        const stars1000 = screen.getByRole('option', { name: '⭐️1000+' });
        await user.click(stars1000);

        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                expect.stringContaining('minStars=1000')
            );
        });
    });

    it('applies both filters together', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Language
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const pythonOption = screen.getByRole('option', { name: 'Python' });
        await user.click(pythonOption);

        // Stars
        const starsSelect = screen.getByRole('combobox', { name: /stars/i });
        await user.click(starsSelect);
        const stars5000 = screen.getByRole('option', { name: '⭐️5000+' });
        await user.click(stars5000);

        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        await waitFor(() => {
            const url = mockPush.mock.calls[0][0];
            expect(url).toContain('language=python');
            expect(url).toContain('minStars=5000');
        });
    });

    it('shows active filters badges after selection', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Выбираем язык
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const jsOption = screen.getByRole('option', { name: 'JavaScript' });
        await user.click(jsOption);

        // Badges должны появиться
        await waitFor(() => {
            expect(screen.getByText('Active filters:')).toBeInTheDocument();
            expect(screen.getByText(/Language:/)).toBeInTheDocument();
        });
    });

    it('removes individual filter via badge X', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Применяем фильтр
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const jsOption = screen.getByRole('option', { name: 'JavaScript' });
        await user.click(jsOption);

        await waitFor(() => {
            expect(screen.getByText(/Language:/)).toBeInTheDocument();
        });

        // Находим X кнопку в badge
        const badges = screen.getAllByRole('button');
        const languageBadgeX = badges.find((btn) =>
            btn.parentElement?.textContent?.includes('Language')
        );

        if (languageBadgeX) {
            await user.click(languageBadgeX);

            // Badge должен исчезнуть
            await waitFor(() => {
                expect(screen.queryByText(/Language:/)).not.toBeInTheDocument();
            });
        }
    });

    it('clears all filters via Clear Filters button', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Применяем оба фильтра
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const jsOption = screen.getByRole('option', { name: 'JavaScript' });
        await user.click(jsOption);

        const starsSelect = screen.getByRole('combobox', { name: /stars/i });
        await user.click(starsSelect);
        const stars1000 = screen.getByRole('option', { name: '⭐️1000+' });
        await user.click(stars1000);

        await waitFor(() => {
            expect(screen.getByText('Active filters:')).toBeInTheDocument();
        });

        // Нажимаем Clear Filters
        const clearButton = screen.getByRole('button', {
            name: /clear filters/i,
        });
        await user.click(clearButton);

        // Badges должны исчезнуть
        await waitFor(() => {
            expect(
                screen.queryByText('Active filters:')
            ).not.toBeInTheDocument();
        });

        // И router.push вызван без фильтров
        expect(mockPush).toHaveBeenCalledWith('/?q=react');
    });

    it('does not include "all" language in URL', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Выбираем "All Languages"
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const allOption = screen.getByRole('option', { name: 'All Languages' });
        await user.click(allOption);

        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        await waitFor(() => {
            const url = mockPush.mock.calls[0][0];
            expect(url).not.toContain('language=');
        });
    });

    it('does not add minStars=0 to URL', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Выбираем 0 stars
        const starsSelect = screen.getByRole('combobox', { name: /stars/i });
        await user.click(starsSelect);
        const stars0 = screen.getByRole('option', { name: '⭐️0+' });
        await user.click(stars0);

        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        await waitFor(() => {
            const url = mockPush.mock.calls[0][0];
            // Должен быть только query без minStars
            expect(url).toBe('/?q=react');
        });
    });

    it('persists filters when searching again', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Применяем фильтр
        const languageSelect = screen.getByRole('combobox', {
            name: /language/i,
        });
        await user.click(languageSelect);
        const jsOption = screen.getByRole('option', { name: 'JavaScript' });
        await user.click(jsOption);

        // Меняем query
        const input = screen.getByPlaceholderText(/search repositories/i);
        await user.clear(input);
        await user.type(input, 'vue');

        // Submit
        const searchButton = screen.getByRole('button', { name: /search/i });
        await user.click(searchButton);

        // URL должен содержать и новый query и старый фильтр
        await waitFor(() => {
            const url = mockPush.mock.calls[0][0];
            expect(url).toContain('q=vue');
            expect(url).toContain('language=javascript');
        });
    });
});
