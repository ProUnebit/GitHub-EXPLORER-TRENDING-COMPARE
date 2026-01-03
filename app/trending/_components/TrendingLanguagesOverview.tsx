'use client';

import { motion, Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, ChessQueen  } from 'lucide-react';
import type { GitHubRepo } from '@/lib/github/types';
import { getLanguageColor } from '@/lib/constants/language-colors';

type TrendingLanguagesOverviewProps = {
    repos: GitHubRepo[];
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.3 + index * 0.05, // Начинаем после появления card
            duration: 0.3,
        },
    }),
};

export function TrendingLanguagesOverview({
    repos,
}: TrendingLanguagesOverviewProps) {
    // ============================================
    // AGGREGATE LANGUAGES (улучшенная версия)
    // ============================================
    const languageCounts = repos.reduce(
        (acc, repo) => {
            // ВАРИАНТ A: Игнорируем репозитории без языка
            if (!repo.language) return acc;

            const lang = repo.language;
            acc[lang] = (acc[lang] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    // ============================================
    // CALCULATE STATS
    // ============================================
    // Считаем total только от репозиториев С языком (для точных процентов)
    const totalWithLanguage = Object.values(languageCounts).reduce(
        (sum, count) => sum + count,
        0
    );

    let languageStats = Object.entries(languageCounts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: ((count / totalWithLanguage) * 100).toFixed(1),
        }))
        .sort((a, b) => b.count - a.count);

    // Берем топ-10
    languageStats = languageStats.slice(0, 15);

    // Edge case: нет языков
    if (languageStats.length === 0) {
        return null;
    }

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="bg-card dark:border-teal-900/60">
                <CardHeader>
                    <CardTitle className="flex items-center text-teal-600 dark:text-amber-300/80">
                        <Code2 className="mr-2 h-4 w-4 text-teal-500" />
                        Trending Languages
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">
                        <span className='text-teal-600'>{totalWithLanguage}</span> of <span className='text-teal-600'>{repos.length}</span> repositories have
                        identified languages
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {languageStats.map((lang, index) => (
                            <motion.div
                                key={lang.name}
                                custom={index}
                                variants={badgeVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                                    style={{
                                        borderLeft: `4px solid ${getLanguageColor(lang.name)}`,
                                    }}
                                >
                                    {index === 0 && (
                                        <ChessQueen  className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                                    )}
                                    <span className='font-semibold'>{lang.name}</span>
                                    <span className="font-bold text-teal-600 dark:text-amber-300/80">
                                        {lang.percentage}%
                                    </span>
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
