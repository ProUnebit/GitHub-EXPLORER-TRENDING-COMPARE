/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChartColumnIncreasing, CodeXml } from 'lucide-react';
import { getLanguageColor } from '@/lib/constants/language-colors';

// ============================================
// CHART.JS SETUP
// ============================================
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// ============================================
// COMPARISON CHARTS - Client Component
// ============================================
// Визуальное сравнение метрик через графики
//
// Паттерн: Server passes data → Client renders visualization
// - ComparisonView фетчит данные (Server)
// - ComparisonCharts рендерит графики (Client)
//
// Графики:
// - Основные метрики (Stars, Forks, Watchers)
// - Топ языки программирования
// - Активность (Contributors)

type RepoData = {
    fullName: string;
    owner: string;
    name: string;
    repo: any;
    languages: any;
    contributors: any[];
};

type ComparisonChartsProps = {
    repos: RepoData[];
};

// Цвета для графиков (teal theme)
const CHART_COLORS = [
    'rgba(20, 184, 166, 0.8)', // teal-500
    'rgba(59, 130, 246, 0.8)', // blue-500
    'rgba(168, 85, 247, 0.8)', // purple-500
    'rgba(236, 72, 153, 0.8)', // pink-500
];

const CHART_BORDER_COLORS = [
    'rgb(20, 184, 166)',
    'rgb(59, 130, 246)',
    'rgb(168, 85, 247)',
    'rgb(236, 72, 153)',
];

export function ComparisonCharts({ repos }: ComparisonChartsProps) {
    // ============================================
    // PREPARE DATA
    // ============================================
    const repoNames = repos.map((r) => r.name);

    // Main metrics data
    const starsData = repos.map((r) => r.repo.stargazers_count);
    const forksData = repos.map((r) => r.repo.forks_count);
    const watchersData = repos.map((r) => r.repo.watchers_count);
    const contributorsData = repos.map((r) => r.contributors.length);

    // Languages data - берем топ-5 языков от каждого репо
    const allLanguages = new Set<string>();
    repos.forEach((repo) => {
        Object.keys(repo.languages).forEach((lang) => allLanguages.add(lang));
    });

    // ============================================
    // CHART CONFIGURATIONS
    // ============================================
    const mainMetricsChart = {
        labels: repoNames,
        datasets: [
            {
                label: 'Stars',
                data: starsData,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_BORDER_COLORS[0],
                borderWidth: 2,
            },
            {
                label: 'Forks',
                data: forksData,
                backgroundColor: CHART_COLORS[1],
                borderColor: CHART_BORDER_COLORS[1],
                borderWidth: 2,
            },
            {
                label: 'Watchers',
                data: watchersData,
                backgroundColor: CHART_COLORS[2],
                borderColor: CHART_BORDER_COLORS[2],
                borderWidth: 2,
            },
        ],
    };

    const activityChart = {
        labels: repoNames,
        datasets: [
            {
                label: 'Contributors',
                data: contributorsData,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_BORDER_COLORS[0],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    // color: '#FFFFFF',
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += new Intl.NumberFormat().format(
                            context.parsed.y
                        );
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        // Format large numbers (1000 → 1k)
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                        if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'k';
                        }
                        return value;
                    },
                },
            },
        },
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Main Metrics Chart */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <ChartColumnIncreasing className="mr-2 inline-block h-5 w-5" />
                        <span className="font-bold">Popularity Metrics</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar data={mainMetricsChart} options={chartOptions} />
                </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="mr-2 inline-block h-5 w-5" />
                        <span className="font-bold">Community Activity</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar data={activityChart} options={chartOptions} />
                </CardContent>
            </Card>

            {/* Languages Breakdown */}
            <Card className="bg-card lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CodeXml className="mr-2 inline-block h-5 w-5" />
                        <span className="font-bold">
                            Languages Distribution
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="pb-5 grid gap-10 md:grid-cols-2 lg:grid-cols-4 pl-8 pr-8">
                        {repos.map((repo) => {
                            const total = Object.values(repo.languages).reduce(
                                (sum: number, bytes: any) => sum + bytes,
                                0
                            );
                            const topLanguages = Object.entries(repo.languages)
                                .map(([name, bytes]: [string, any]) => ({
                                    name,
                                    percentage: ((bytes / total) * 100).toFixed(
                                        1
                                    ),
                                }))
                                .sort(
                                    (a, b) =>
                                        parseFloat(b.percentage) -
                                        parseFloat(a.percentage)
                                )
                                .slice(0, 5);

                            return (
                                <div key={repo.fullName} className="space-y-3">
                                    <h4 className="text-lg font-bold text-teal-600">
                                        {repo.name}
                                    </h4>
                                    <div className="space-y-4">
                                        {topLanguages.map((lang) => (
                                            <div
                                                key={lang.name}
                                                className="space-y-1"
                                            >
                                                <div className="flex justify-between text-sm">
                                                    <span >
                                                        {lang.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {lang.percentage}%
                                                    </span>
                                                </div>
                                                <div className="bg-muted h-2 overflow-hidden rounded-xs">
                                                    <div
                                                        className="h-full bg-teal-500 transition-all"
                                                        style={{
                                                            width: `${lang.percentage}%`,
                                                            backgroundColor: getLanguageColor(lang.name)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
