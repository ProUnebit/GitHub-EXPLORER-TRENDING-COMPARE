'use client';

import { motion, Variants } from 'framer-motion';
import { TrendingCard } from './TrendingCard';
import type { GitHubRepo } from '@/lib/github/types';

type TrendingListClientProps = {
    repos: GitHubRepo[];
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

export function TrendingListClient({ repos }: TrendingListClientProps) {
    return (
        <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {repos.map((repo, index) => (
                <motion.div key={repo.id} variants={itemVariants as Variants}>
                    <TrendingCard repo={repo} rank={index + 1} />
                </motion.div>
            ))}
        </motion.div>
    );
}
