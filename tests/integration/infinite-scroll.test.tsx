import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchResultsClient } from '@/app/_components/SearchResultsClient';
import { mockRepo, mockRepo2 } from '@/tests/mocks/fixtures';

describe('Infinite Scroll Flow Integration', () => {
    const initialRepos = [mockRepo, mockRepo2];
    const defaultProps = {
        initialRepos,
        query: 'react',
        sort: 'stars',
        totalCount: 100,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays initial repos', () => {
        render(<SearchResultsClient {...defaultProps} />);

        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('vue')).toBeInTheDocument();
        expect(screen.getByText('Found 100 repositories')).toBeInTheDocument();
        expect(screen.getByText('(showing 2)')).toBeInTheDocument();
    });

    it('shows per page selector', () => {
        render(<SearchResultsClient {...defaultProps} />);

        expect(screen.getByText('30 per page')).toBeInTheDocument();
    });

    it('loads more repos on button click', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} />);

        expect(screen.getAllByRole('article')).toHaveLength(2);

        // Нажимаем Load More
        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        // Должен показать loading
        await waitFor(() => {
            expect(screen.getByText(/loading more/i)).toBeInTheDocument();
        });

        // После загрузки - больше репо
        await waitFor(() => {
            expect(screen.getAllByRole('article').length).toBeGreaterThan(2);
        });
    });

    it('shows loading spinner during fetch', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} />);

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        expect(
            screen.getByText(/loading more repositories/i)
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/loading more/i)).not.toBeInTheDocument();
        });
    });

    it('hides Load More when all loaded', async () => {
        const user = userEvent.setup();
        render(
            <SearchResultsClient
                {...defaultProps}
                totalCount={4} // После первой загрузки будет 4/4
            />
        );

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        // После загрузки все репо загружены
        await waitFor(() => {
            expect(
                screen.getByText(/all 4 repositories loaded/i)
            ).toBeInTheDocument();
            expect(
                screen.queryByRole('button', { name: /load more/i })
            ).not.toBeInTheDocument();
        });
    });

    it('changes per page and reloads', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} />);

        expect(screen.getByText('(showing 2)')).toBeInTheDocument();

        // Открываем per page selector
        const perPageSelect = screen.getByRole('combobox');
        await user.click(perPageSelect);

        // Выбираем 50
        const option50 = screen.getByRole('option', { name: '50 per page' });
        await user.click(option50);

        // Должен показать loading
        await waitFor(() => {
            expect(screen.getByText(/loading more/i)).toBeInTheDocument();
        });

        // После загрузки - обновленный список
        await waitFor(() => {
            expect(screen.queryByText(/loading more/i)).not.toBeInTheDocument();
        });

        // window.scrollTo должен быть вызван
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('disables per page selector during loading', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} />);

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        // Селектор должен быть disabled
        const perPageSelect = screen.getByRole('combobox');
        expect(perPageSelect).toBeDisabled();

        // После загрузки - enabled
        await waitFor(() => {
            expect(perPageSelect).not.toBeDisabled();
        });
    });

    it('handles API errors gracefully', async () => {
        const user = userEvent.setup();
        render(
            <SearchResultsClient
                {...defaultProps}
                query="error" // Триггерит ошибку в MSW
            />
        );

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        // Должен показать ошибку
        await waitFor(() => {
            expect(
                screen.getByText(/api rate limit exceeded/i)
            ).toBeInTheDocument();
        });

        // Кнопка Try Again
        const retryButton = screen.getByRole('button', { name: /try again/i });
        expect(retryButton).toBeInTheDocument();
    });

    it('retry after error', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} query="error" />);

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        await waitFor(() => {
            expect(
                screen.getByText(/api rate limit exceeded/i)
            ).toBeInTheDocument();
        });

        const retryButton = screen.getByRole('button', { name: /try again/i });
        await user.click(retryButton);

        // Должен попытаться снова
        expect(screen.getByText(/loading more/i)).toBeInTheDocument();
    });

    it('updates showing count after load', async () => {
        const user = userEvent.setup();
        render(<SearchResultsClient {...defaultProps} />);

        expect(screen.getByText('(showing 2)')).toBeInTheDocument();

        const loadMoreButton = screen.getByRole('button', {
            name: /load more/i,
        });
        await user.click(loadMoreButton);

        await waitFor(() => {
            expect(screen.getByText('(showing 4)')).toBeInTheDocument();
        });
    });
});
