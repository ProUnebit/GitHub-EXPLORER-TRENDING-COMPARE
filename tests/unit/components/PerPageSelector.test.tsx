import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PerPageSelector } from '@/app/_components/PerPageSelector';

describe('PerPageSelector', () => {
    const mockOnChange = vi.fn();

    it('renders with current value', () => {
        render(<PerPageSelector value={30} onChange={mockOnChange} />);

        expect(screen.getByText('30 per page')).toBeInTheDocument();
    });

    it('shows all options when opened', async () => {
        const user = userEvent.setup();
        render(<PerPageSelector value={30} onChange={mockOnChange} />);

        // Открываем dropdown
        const trigger = screen.getByRole('combobox');
        await user.click(trigger);

        // Проверяем что все опции отображаются
        expect(screen.getByText('20 per page')).toBeInTheDocument();
        expect(screen.getByText('30 per page')).toBeInTheDocument();
        expect(screen.getByText('50 per page')).toBeInTheDocument();
    });

    it('calls onChange when option selected', async () => {
        const user = userEvent.setup();
        render(<PerPageSelector value={30} onChange={mockOnChange} />);

        // Открываем dropdown
        const trigger = screen.getByRole('combobox');
        await user.click(trigger);

        // Выбираем 50
        const option50 = screen.getByRole('option', { name: '50 per page' });
        await user.click(option50);

        expect(mockOnChange).toHaveBeenCalledWith(50);
    });

    it('can be disabled', () => {
        render(
            <PerPageSelector
                value={30}
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const trigger = screen.getByRole('combobox');
        expect(trigger).toBeDisabled();
    });

    it('converts string to number on change', async () => {
        const user = userEvent.setup();
        render(<PerPageSelector value={30} onChange={mockOnChange} />);

        const trigger = screen.getByRole('combobox');
        await user.click(trigger);

        const option20 = screen.getByRole('option', { name: '20 per page' });
        await user.click(option20);

        // Должен передать number, не string
        expect(mockOnChange).toHaveBeenCalledWith(20);
        expect(typeof mockOnChange.mock.calls[0][0]).toBe('number');
    });
});
