import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IssuesOverviewCards } from '@/app/repo/[owner]/[name]/_components/IssuesOverviewCards';

describe('IssuesOverviewCards', () => {
    it('should render all metric cards', () => {
        render(<IssuesOverviewCards total={100} open={30} closed={70} avgCloseTime={5.5} avgResponseTime={2.3} />);
        // Component uses "Open" and "Closed" as labels, not "Open Issues" and "Closed Issues"
        expect(screen.getByText('Total Issues')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByText('Closed')).toBeInTheDocument();
        expect(screen.getByText('Avg Close Time')).toBeInTheDocument();
    });

    it('should display correct values', () => {
        render(<IssuesOverviewCards total={150} open={45} closed={105} avgCloseTime={7.2} avgResponseTime={3.1} />);
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
        expect(screen.getByText('105')).toBeInTheDocument();
    });

    it('should calculate percentages correctly', () => {
        render(<IssuesOverviewCards total={200} open={50} closed={150} avgCloseTime={5} avgResponseTime={2} />);
        // Component uses Math.round and formats as "X% of total"
        // 50/200 = 25%, 150/200 = 75%
        expect(screen.getByText('25% of total')).toBeInTheDocument();
        expect(screen.getByText('75% of total')).toBeInTheDocument();
    });

    it('should show warning ring when open > 25%', () => {
        const { container } = render(<IssuesOverviewCards total={100} open={30} closed={70} avgCloseTime={5} avgResponseTime={2} />);
        // 30% open > 25% threshold = 'needs-attention' health status
        // The card has ring-orange-500/50 class
        const warningCard = container.querySelector('[class*="ring-orange"]');
        expect(warningCard).toBeInTheDocument();
    });
});
