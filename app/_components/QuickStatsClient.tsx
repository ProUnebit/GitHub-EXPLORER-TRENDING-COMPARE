'use client';

import { motion, Variants } from 'framer-motion'; 
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Star, Code2, GitFork } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatters';
import type { GitHubSearchResponse } from '@/lib/github/types';

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

type Stat = {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    subtext: string;
    gradient: string;
};

// ============================================
// CLIENT WRAPPER для анимации
// ============================================
export function QuickStatsClient({ data }: { data: GitHubSearchResponse }) {
    // Calculate statistics
    const totalStars = data.items.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
    );

    const totalForks = data.items.reduce(
        (sum, repo) => sum + repo.forks_count,
        0
    );

    const languages = new Set(
        data.items.map((r) => r.language).filter(Boolean)
    ).size;

    const stats: Stat[] = [
        {
            icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
            value: data.items.length,
            label: 'Trending',
            subtext: 'Hot repositories',
            gradient: 'from-orange-500/10 via-red-500/10 to-pink-500/10',
        },
        {
            icon: <Star className="h-6 w-6 text-yellow-500" />,
            value: formatNumber(totalStars),
            label: 'Total Stars',
            subtext: 'Combined today',
            gradient: 'from-yellow-500/10 via-amber-500/10 to-orange-500/10',
        },
        {
            icon: <GitFork className="h-6 w-6 text-blue-500" />,
            value: formatNumber(totalForks),
            label: 'Total Forks',
            subtext: 'Active projects today',
            gradient: 'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
        },
        {
            icon: <Code2 className="h-6 w-6 text-teal-500" />,
            value: `${languages}+`,
            label: 'Languages',
            subtext: 'In trending today',
            gradient: 'from-teal-500/10 via-green-500/10 to-emerald-500/10',
        },
    ];

    return (
        <motion.div
            className="grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <Card
                        className={`cut-corners group relative overflow-hidden border-none bg-linear-to-br ${stat.gradient} backdrop-blur-lg transition-all duration-300 select-none`}
                    >
                        <CardContent className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="mb-3 transition-transform duration-300 group-hover:scale-130">
                                {stat.icon}
                            </div>

                            {/* Value */}
                            <div className="mb-1 text-3xl font-bold text-foreground">
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="mb-1 text-sm font-medium text-foreground/90">
                                {stat.label}
                            </div>

                            {/* Subtext */}
                            <div className="text-xs text-muted-foreground transition-all duration-200 group-hover:scale-120 group-hover:text-primary">
                                {stat.subtext}
                            </div>

                            {/* Decorative gradient overlay on hover */}
                            <div className="absolute inset-0 -z-10 bg-linear-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
