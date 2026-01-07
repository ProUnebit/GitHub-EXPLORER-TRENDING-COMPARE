// app/repo/[owner]/[name]/_components/IssuesOverviewCards.tsx

/**
 * ============================================
 * ISSUES OVERVIEW CARDS
 * ============================================
 * 
 * Карточки с базовой статистикой issues
 * 
 * Показывает:
 * - Total issues
 * - Open issues (%)
 * - Closed issues (%)
 * - Average close time
 * 
 * Server Component - статичные данные
 */

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, BarChart3 } from 'lucide-react';

// ============================================
// TYPES
// ============================================
type IssuesOverviewCardsProps = {
    total: number;
    open: number;
    closed: number;
    avgCloseTime: number; // в днях
    avgResponseTime: number; // в часах
};

// ============================================
// HELPER: Format time
// ============================================
function formatCloseTime(days: number): string {
    if (days < 1) {
        return `${Math.round(days * 24)}h`;
    }
    if (days < 7) {
        return `${Math.round(days)}d`;
    }
    if (days < 30) {
        const weeks = Math.round(days / 7);
        return `${weeks}w`;
    }
    const months = Math.round(days / 30);
    return `${months}mo`;
}

// ============================================
// COMPONENT
// ============================================
export function IssuesOverviewCards({
    total,
    open,
    closed,
    avgCloseTime,
    avgResponseTime,
}: IssuesOverviewCardsProps) {
    // Проценты
    const openPercentage = total > 0 ? Math.round((open / total) * 100) : 0;
    const closedPercentage = total > 0 ? Math.round((closed / total) * 100) : 0;

    // Определяем "здоровье" проекта по проценту open issues
    // ПОЧЕМУ ТАК: >20% open issues = много нерешенных проблем
    const healthStatus =
        openPercentage <= 15
            ? 'excellent'
            : openPercentage <= 25
              ? 'good'
              : 'needs-attention';

    const cards = [
        {
            icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
            label: 'Total Issues',
            value: total,
            subtext: 'All time',
            color: 'text-purple-600',
        },
        {
            icon: <Circle className="h-6 w-6 text-orange-600" />,
            label: 'Open',
            value: open,
            subtext: `${openPercentage}% of total`,
            color: 'text-orange-600',
            highlight: healthStatus === 'needs-attention',
        },
        {
            icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
            label: 'Closed',
            value: closed,
            subtext: `${closedPercentage}% of total`,
            color: 'text-green-600',
        },
        {
            icon: <Clock className="h-6 w-6 text-blue-600" />,
            label: 'Avg Close Time',
            value: formatCloseTime(avgCloseTime),
            subtext: avgCloseTime < 7 ? 'Fast response ✅' : 'Avg response',
            color: 'text-blue-600',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className={`
                        bg-linear-to-br from-background to-muted/20
                        ${card.highlight ? 'ring-2 ring-orange-500/50' : ''}
                    `}
                >
                    <CardContent className="px-4 sm:px-6">
                        {/* Icon */}
                        <div className="mb-2">{card.icon}</div>

                        {/* Value */}
                        <div className={`mb-1 text-4xl font-bold ${card.color}`}>
                            {card.value}
                        </div>

                        {/* Label */}
                        <div className="mb-1 text-md font-medium text-foreground">
                            {card.label}
                        </div>

                        {/* Subtext */}
                        <div className="text-sm text-muted-foreground">
                            {card.subtext}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
