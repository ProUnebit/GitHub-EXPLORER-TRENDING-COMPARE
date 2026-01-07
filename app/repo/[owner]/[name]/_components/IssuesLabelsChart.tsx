// app/repo/[owner]/[name]/_components/IssuesLabelsChart.tsx

'use client';

/**
 * ============================================
 * ISSUES LABELS CHART
 * ============================================
 * 
 * Горизонтальный bar chart с топ-5 labels
 * 
 * Показывает:
 * - Название label
 * - Количество issues с этим label
 * - Процент от общего количества
 * - Цвет label (как на GitHub)
 * 
 * ПОЧЕМУ HORIZONTAL BAR:
 * - Лучше помещаются длинные названия labels
 * - Легко сравнить количества
 * - Компактнее на мобильных
 */

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { LabelStats } from '@/lib/github/types';
import { useTheme } from 'next-themes';

// ============================================
// REGISTER CHART.JS COMPONENTS
// ============================================
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ============================================
// TYPES
// ============================================
type IssuesLabelsChartProps = {
    labels: LabelStats[];
};

// ============================================
// HELPER: Convert hex to RGB
// ============================================
// ПОЧЕМУ НУЖЕН: GitHub API дает цвет в hex (e.g. "d73a4a")
// Нам нужен rgba для прозрачности
function hexToRgba(hex: string, alpha: number = 1): string {
    // Удаляем # если есть
    hex = hex.replace('#', '');
    
    // Парсим RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// COMPONENT
// ============================================
export function IssuesLabelsChart({ labels }: IssuesLabelsChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // ============================================
    // PREPARE DATA
    // ============================================
    
    // Названия labels (обрезаем если длинные)
    const labelNames = labels.map((label) => {
        return label.name.length > 20 
            ? label.name.substring(0, 20) + '...' 
            : label.name;
    });

    // Цвета баров (используем цвета GitHub labels)
    const backgroundColors = labels.map((label) => 
        hexToRgba(label.color, 0.8)
    );
    
    const borderColors = labels.map((label) => 
        hexToRgba(label.color, 1)
    );

    const data = {
        labels: labelNames,
        datasets: [
            {
                label: 'Issues',
                data: labels.map((label) => label.count),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 30,
            },
        ],
    };

    // ============================================
    // CHART OPTIONS
    // ============================================
    const options = {
        indexAxis: 'y' as const, // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Не нужна legend для одного dataset
            },
            tooltip: {
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#e5e7eb' : '#111827',
                bodyColor: isDark ? '#e5e7eb' : '#111827',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: function (context: any) {
                        const index = context[0].dataIndex;
                        return labels[index].name; // Полное название
                    },
                    label: function (context: any) {
                        const index = context.dataIndex;
                        const count = labels[index].count;
                        const percentage = labels[index].percentage.toFixed(1);
                        return `${count} issues (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: isDark ? '#374151' : '#e5e7eb',
                    drawBorder: false,
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    font: {
                        size: 11,
                    },
                    precision: 0, // Целые числа
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    font: {
                        size: 11,
                        weight: '500' as const,
                    },
                },
            },
        },
    };

    return (
        <div className="h-64 w-full">
            <Bar data={data} options={options} />
        </div>
    );
}
