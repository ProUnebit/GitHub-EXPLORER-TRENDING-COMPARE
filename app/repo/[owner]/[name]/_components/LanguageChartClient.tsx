'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { getLanguageColor } from '@/lib/constants/language-colors'; // ← Добавь

ChartJS.register(ArcElement, Tooltip, Legend);

type LanguageData = {
    name: string;
    bytes: number;
    percentage: number;
};

type LanguageChartClientProps = {
    languages: LanguageData[];
};

export function LanguageChartClient({ languages }: LanguageChartClientProps) {
    const topLanguages = languages.slice(0, 5);

    const chartData = {
        labels: topLanguages.map((l) => l.name),
        datasets: [
            {
                data: topLanguages.map((l) => l.percentage),
                backgroundColor: topLanguages.map((l) =>
                    getLanguageColor(l.name)
                ),
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value.toFixed(1)}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="mx-auto w-full max-w-md">
            <Doughnut data={chartData} options={options} />

            <div className="mt-6 space-y-2">
                {topLanguages.map((lang) => (
                    <div
                        key={lang.name}
                        className="flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{
                                    backgroundColor: getLanguageColor(
                                        lang.name
                                    ),
                                }}
                            />
                            <span className="text-lg">{lang.name}</span>
                        </div>
                        <span className="text-muted-foreground text-lg">
                            {lang.percentage.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
