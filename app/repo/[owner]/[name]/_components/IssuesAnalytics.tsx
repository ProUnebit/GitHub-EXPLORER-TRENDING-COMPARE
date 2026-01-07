// app/repo/[owner]/[name]/_components/IssuesAnalytics.tsx

/**
 * ============================================
 * ISSUES ANALYTICS
 * ============================================
 * 
 * Комплексная аналитика issues репозитория
 * 
 * Server Component:
 * - Получает данные на сервере
 * - Кешируется Next.js
 * - Передает данные в client components для интерактивности
 * 
 * Структура:
 * 1. Overview Cards - базовая статистика
 * 2. Timeline Chart - динамика open/closed issues
 * 3. Labels Distribution - популярные метки
 * 4. Top Issues - самые обсуждаемые
 */

import { getIssuesAnalytics } from '@/lib/github/api';
import { IssuesOverviewCards } from './IssuesOverviewCards';
import { IssuesTimelineChart } from './IssuesTimelineChart';
import { IssuesLabelsChart } from './IssuesLabelsChart';
import { TopIssuesList } from './TopIssuesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText, Tags, ThermometerSun } from 'lucide-react';

// ============================================
// TYPES
// ============================================
type IssuesAnalyticsProps = {
    owner: string;
    name: string;
};

// ============================================
// COMPONENT
// ============================================
export async function IssuesAnalytics({
    owner,
    name,
}: IssuesAnalyticsProps) {
    // Получаем аналитику на сервере
    // ПОЧЕМУ ТАК: Server Component = SEO, кеширование, быстрая загрузка
    const analytics = await getIssuesAnalytics(owner, name);

    // Если нет issues - не показываем секцию
    if (analytics.total === 0) {
        return null;
    }

    return (
        <Card className="bg-card dark:border-teal-900/60 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-amber-300/80">
                    <MessageSquareText className="h-6 w-6 text-teal-500" />
                    Issues Analytics
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* ============================================ */}
                {/* OVERVIEW CARDS - Базовая статистика */}
                {/* ============================================ */}
                <IssuesOverviewCards
                    total={analytics.total}
                    open={analytics.open}
                    closed={analytics.closed}
                    avgCloseTime={analytics.avgCloseTime}
                    avgResponseTime={analytics.avgResponseTime}
                />

                {/* ============================================ */}
                {/* TIMELINE CHART - График динамики */}
                {/* Client Component для интерактивности */}
                {/* ============================================ */}
                <div className="overflow-hidden">
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        Issues Activity (Last <span className='text-teal-500'>6 months</span>)
                    </h3>
                    <IssuesTimelineChart timeline={analytics.timeline} />
                </div>

                {/* ============================================ */}
                {/* GRID: Labels + Top Issues */}
                {/* На мобильных - 1 колонка, на desktop - 2 */}
                {/* ============================================ */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Labels Distribution */}
                    {analytics.topLabels.length > 0 && (
                        <div className="min-w-0 overflow-hidden">
                            <h3 className="mb-3 text-sm font-medium flex items-center text-teal-600 dark:text-amber-300/80">
                                <Tags className='mr-2 h-4 w-4 text-teal-500' />
                                Top Labels
                            </h3>
                            <IssuesLabelsChart labels={analytics.topLabels} />
                        </div>
                    )}

                    {/* Top Issues */}
                    {analytics.hottestIssues.length > 0 && (
                        <div className="min-w-0 overflow-hidden">
                            <h3 className="mb-3 text-sm font-medium flex items-center text-teal-600 dark:text-amber-300/80">
                                <ThermometerSun className='mr-2 h-4 w-4 text-teal-500' />
                                Hottest Issues
                            </h3>
                            <TopIssuesList issues={analytics.hottestIssues} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
