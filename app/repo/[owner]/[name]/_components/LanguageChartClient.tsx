'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { getLanguageColor } from '@/lib/constants/language-colors';
import { Github } from 'lucide-react';

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
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 0,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed;
                        return `  ${value.toFixed(1)}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="mx-auto w-full max-w-md">
          <div className='relative'>
            <Github className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-stone-400 opacity-40' />
            <Doughnut data={chartData} options={options} />
          </div>

            <div className="mt-6 space-y-2">
                {topLanguages.map((lang) => (
                    <div
                        key={lang.name}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{
                                    backgroundColor: getLanguageColor(
                                        lang.name
                                    ),
                                }}
                            />
                            <span className="text-md">{lang.name}</span>
                        </div>
                        <span className="text-muted-foreground text-md">
                            {lang.percentage.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
