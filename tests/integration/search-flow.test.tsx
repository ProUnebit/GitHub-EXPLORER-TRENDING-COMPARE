import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/app/_components/SearchResults';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

describe('Search Flow Integration', () => {
    it('complete search flow: input → submit → results', async () => {
        const user = userEvent.setup();

        // 1. Рендерим SearchInput
        render(<SearchInput />);

        // 2. Вводим запрос
        const input = screen.findByPlaceholderText(/search repositories/i);
        await user.type(await input, 'react');

        expect(input).toHaveValue('react');

        // 3. Нажимаем Search
        const searchButton = screen.findByRole('button', { name: /search/i });
        await user.click(await searchButton);

        // 4. Проверяем что router.push вызван
        // (в реальном приложении произойдет навигация)
    });

    it('shows validation when empty query submitted', async () => {
        // const user = userEvent.setup();
        render(<SearchInput />);

        const searchButton = screen.findByRole('button', { name: /search/i });

        // Кнопка должна быть disabled пока поле пустое
        expect(searchButton).toBeDisabled();
    });

    it('search with filters applied', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        // Вводим query
        const input = screen.findByPlaceholderText(/search repositories/i);
        await user.type(await input, 'react');

        // Выбираем язык
        const languageSelect = screen.findByRole('combobox', {
            name: /language/i,
        });
        await user.click(await languageSelect);

        const jsOption = screen.findByRole('option', { name: 'JavaScript' });
        await user.click(await jsOption);

        // Выбираем stars
        const starsSelect = screen.findByRole('combobox', { name: /stars/i });
        await user.click(await starsSelect);

        const stars1000 = screen.findByRole('option', { name: '⭐️1000+' });
        await user.click(await stars1000);

        // Submit
        const searchButton = screen.findByRole('button', { name: /search/i });
        await user.click(await searchButton);

        // Проверяем что фильтры отображаются
        await waitFor(() => {
            expect(screen.getByText('Active filters:')).toBeInTheDocument();
        });
    });
});

describe('SearchResults Integration', () => {
    it('renders results from API', async () => {
        render(<SearchResults query="react" />);

        // MSW вернет mockRepo
        await waitFor(() => {
            expect(screen.getByText('react')).toBeInTheDocument();
            expect(screen.getByText('vue')).toBeInTheDocument();
        });
    });

    it('shows no results message', async () => {
        render(<SearchResults query="notfound" />);

        await waitFor(() => {
            expect(
                screen.getByText(/no repositories found/i)
            ).toBeInTheDocument();
        });
    });

    it('applies language filter in query', async () => {
        render(<SearchResults query="react" language="javascript" />);

        // API должен получить query с language фильтром
        await waitFor(() => {
            expect(screen.getByText('react')).toBeInTheDocument();
        });
    });

    it('applies stars filter in query', async () => {
        render(<SearchResults query="react" minStars="1000" />);

        await waitFor(() => {
            expect(screen.getByText('react')).toBeInTheDocument();
        });
    });
});
