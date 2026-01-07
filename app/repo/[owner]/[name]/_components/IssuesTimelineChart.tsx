// app/repo/[owner]/[name]/_components/IssuesTimelineChart.tsx

'use client';

/**
 * ============================================
 * ISSUES TIMELINE CHART
 * ============================================
 * 
 * График динамики issues за последние 6 месяцев
 * 
 * Показывает:
 * - Open issues (красная линия)
 * - Closed issues (зеленая линия)
 * 
 * Client Component:
 * - Chart.js требует DOM
 * - Интерактивность (hover, tooltips)
 * 
 * ПОЧЕМУ LINE CHART:
 * - Отлично показывает тренды
 * - Видно растет ли backlog или уменьшается
 * - Легко сравнить open vs closed
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

    // ============================================
    // PREPARE DATA
    // ============================================
    
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
                borderColor: 'rgb(239, 68, 68)', // red-500
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.3, // Smooth curves
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(239, 68, 68)',
            },
            {
                label: 'Closed Issues',
                data: timeline.map((item) => item.closed),
                borderColor: 'rgb(34, 197, 94)', // green-500
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
    // CHART OPTIONS
    // ============================================
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151', // gray-200 : gray-700
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: isDark ? '#1f2937' : '#ffffff', // gray-800 : white
                titleColor: isDark ? '#e5e7eb' : '#111827', // gray-200 : gray-900
                bodyColor: isDark ? '#e5e7eb' : '#111827',
                borderColor: isDark ? '#374151' : '#e5e7eb', // gray-700 : gray-200
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function (context: any) {
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
                    color: isDark ? '#9ca3af' : '#6b7280', // gray-400 : gray-500
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? '#374151' : '#e5e7eb', // gray-700 : gray-200
                    drawBorder: false,
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    font: {
                        size: 12,
                    },
                    precision: 0, // Целые числа
                },
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="h-64 w-full sm:h-72">
            <Line data={data} options={options} />
        </div>
    );
}
