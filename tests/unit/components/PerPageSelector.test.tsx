import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PerPageSelector } from '@/app/_components/PerPageSelector';

// PerPageSelector COMPONENT TESTS

describe('PerPageSelector', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // BASIC RENDERING

    describe('rendering', () => {
        it('renders with current value', () => {
            render(<PerPageSelector value={30} onChange={mockOnChange} />);
            expect(screen.getByText('30 per page')).toBeInTheDocument();
        });

        it('renders combobox', () => {
            render(<PerPageSelector value={30} onChange={mockOnChange} />);
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        it('displays different values correctly', () => {
            const { rerender } = render(
                <PerPageSelector value={20} onChange={mockOnChange} />
            );
            expect(screen.getByText('20 per page')).toBeInTheDocument();

            rerender(<PerPageSelector value={50} onChange={mockOnChange} />);
            expect(screen.getByText('50 per page')).toBeInTheDocument();

            rerender(<PerPageSelector value={100} onChange={mockOnChange} />);
            expect(screen.getByText('100 per page')).toBeInTheDocument();
        });
    });

    // OPTIONS

    describe('options', () => {
        it('shows all options when opened', async () => {
            const user = userEvent.setup();
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            await user.click(trigger);

            expect(screen.getByRole('option', { name: '20 per page' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: '30 per page' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: '50 per page' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: '100 per page' })).toBeInTheDocument();
        });

        it('has 4 options', async () => {
            const user = userEvent.setup();
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            await user.click(trigger);

            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(4);
        });
    });

    // SELECTION

    describe('selection', () => {
        it('calls onChange when option selected', async () => {
            const user = userEvent.setup();
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            await user.click(trigger);

            const option50 = screen.getByRole('option', { name: '50 per page' });
            await user.click(option50);

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });

        it('converts string value to number', async () => {
            const user = userEvent.setup();
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            await user.click(trigger);

            const option20 = screen.getByRole('option', { name: '20 per page' });
            await user.click(option20);

            expect(mockOnChange).toHaveBeenCalledWith(20);
            expect(typeof mockOnChange.mock.calls[0][0]).toBe('number');
        });

        it('calls onChange with 100 when selecting 100 per page', async () => {
            const user = userEvent.setup();
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            await user.click(trigger);

            const option100 = screen.getByRole('option', { name: '100 per page' });
            await user.click(option100);

            expect(mockOnChange).toHaveBeenCalledWith(100);
        });
    });

    // DISABLED STATE

    describe('disabled state', () => {
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

        it('is enabled by default', () => {
            render(<PerPageSelector value={30} onChange={mockOnChange} />);

            const trigger = screen.getByRole('combobox');
            expect(trigger).not.toBeDisabled();
        });
    });
});
