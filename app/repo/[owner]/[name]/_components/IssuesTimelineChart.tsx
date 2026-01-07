// app/repo/[owner]/[name]/_components/IssuesTimelineChart.tsx

'use client';

/**
 * ============================================
 * ISSUES TIMELINE CHART
 * ============================================
 * 
 * График динамики issues за последние 6 месяцев
 */

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import type { IssueTimelineData } from '@/lib/github/types';
import { useTheme } from 'next-themes';

// ============================================
// REGISTER CHART.JS COMPONENTS
// ============================================
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// ============================================
// TYPES
// ============================================
type IssuesTimelineChartProps = {
    timeline: IssueTimelineData[];
};

// ============================================
// COMPONENT
// ============================================
export function IssuesTimelineChart({ timeline }: IssuesTimelineChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Labels - месяцы (Jun, Jul, Aug, ...)
    const labels = timeline.map((item) => {
        const [year, month] = item.date.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short' });
    });

    // Data для графика
    const data = {
        labels,
        datasets: [
            {
                label: 'Open Issues',
                data: timeline.map((item) => item.open),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(239, 68, 68)',
            },
            {
                label: 'Closed Issues',
                data: timeline.map((item) => item.closed),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(34, 197, 94)',
            },
        ],
    };

    // ============================================
    // CHART OPTIONS - ПРАВИЛЬНАЯ ТИПИЗАЦИЯ
    // ============================================
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    font: {
                        size: 12,
                        weight: 500, // ✅ Изменил с '500' на 500 (число)
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#e5e7eb' : '#111827',
                bodyColor: isDark ? '#e5e7eb' : '#111827',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value} issues`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? '#374151' : '#e5e7eb',
                    drawOnChartArea: true,
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    font: {
                        size: 11,
                    },
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    return (
        <div className="h-64 w-full sm:h-72">
            <Line data={data} options={options} />
        </div>
    );
}
