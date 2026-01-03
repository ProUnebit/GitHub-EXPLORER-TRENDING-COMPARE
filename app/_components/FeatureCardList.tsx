'use client'

import { motion, Variants } from 'framer-motion';
import { FeatureCard } from './FeatureCard';

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
    hidden: { opacity: 0, y: 25 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: 'easeOut',
        },
    },
};

export function FeatureCardList() {
    return (
        <motion.div
            className="  grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Repository Search"
                    description="Search millions of GitHub repositories with advanced filters"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Detailed Analytics"
                    description="View commits, contributors, languages, and activity trends"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Trending Repos"
                    description="Discover what's trending in the open source community"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Side-by-Side Comparison"
                    description="Compare multiple repositories to make informed decisions"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Export Data"
                    description="Export repository data to PDF or CSV for reporting"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <FeatureCard
                    title="Real-time Updates"
                    description="Server-side data fetching with smart caching strategies"
                />
            </motion.div>
        </motion.div>
    );
}
