// tests/unit/components/issues/IssuesTimelineChart.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { IssuesTimelineChart } from '@/app/repo/[owner]/[name]/_components/IssuesTimelineChart';
import type { IssueTimelineData } from '@/lib/github/types';

vi.mock('react-chartjs-2', () => ({
    Line: vi.fn(({ data, options }) => (
        <div data-testid="mock-chart" data-chart-type="line">
            <div data-testid="chart-data">{JSON.stringify(data)}</div>
            <div data-testid="chart-options">{JSON.stringify(options)}</div>
        </div>
    )),
}));

vi.mock('chart.js', () => ({
    Chart: { register: vi.fn() },
    CategoryScale: vi.fn(), LinearScale: vi.fn(), PointElement: vi.fn(),
    LineElement: vi.fn(), Title: vi.fn(), Tooltip: vi.fn(),
    Legend: vi.fn(), Filler: vi.fn(),
}));

describe('IssuesTimelineChart', () => {
    const mockTimeline: IssueTimelineData[] = [
        { date: '2024-08', open: 10, closed: 5 },
        { date: '2024-09', open: 15, closed: 8 },
    ];

    it('should render chart component', () => {
        const { getByTestId } = render(<IssuesTimelineChart timeline={mockTimeline} />);
        expect(getByTestId('mock-chart')).toBeInTheDocument();
    });

    it('should format dates as month labels', () => {
        const { getByTestId } = render(<IssuesTimelineChart timeline={mockTimeline} />);
        const chartData = JSON.parse(getByTestId('chart-data').textContent || '{}');
        expect(chartData.labels).toEqual(['Aug', 'Sep']);
    });

    it('should create two datasets', () => {
        const { getByTestId } = render(<IssuesTimelineChart timeline={mockTimeline} />);
        const chartData = JSON.parse(getByTestId('chart-data').textContent || '{}');
        expect(chartData.datasets).toHaveLength(2);
        expect(chartData.datasets[0].label).toBe('Open Issues');
        expect(chartData.datasets[1].label).toBe('Closed Issues');
    });

    it('should include correct data values', () => {
        const { getByTestId } = render(<IssuesTimelineChart timeline={mockTimeline} />);
        const chartData = JSON.parse(getByTestId('chart-data').textContent || '{}');
        expect(chartData.datasets[0].data).toEqual([10, 15]);
        expect(chartData.datasets[1].data).toEqual([5, 8]);
    });
});
