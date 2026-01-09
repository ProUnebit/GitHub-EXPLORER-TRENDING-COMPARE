import { getIssuesAnalytics } from '@/lib/github/api';
import { IssuesOverviewCards } from './IssuesOverviewCards';
import { IssuesTimelineChart } from './IssuesTimelineChart';
import { IssuesLabelsChart } from './IssuesLabelsChart';
import { TopIssuesList } from './TopIssuesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { MessageSquareText, Tags, ThermometerSun } from 'lucide-react';

type IssuesAnalyticsProps = {
    owner: string;
    name: string;
};

export async function IssuesAnalytics({
    owner,
    name,
}: IssuesAnalyticsProps) {
    const analytics = await getIssuesAnalytics(owner, name);

    if (analytics.total === 0) return null;

    return (
        <Card className="bg-card dark:border-teal-900/60 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-amber-300/80">
                    <MessageSquareText className="h-6 w-6 text-teal-500" />
                    Issues Analytics
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <IssuesOverviewCards
                    total={analytics.total}
                    open={analytics.open}
                    closed={analytics.closed}
                    avgCloseTime={analytics.avgCloseTime}
                    avgResponseTime={analytics.avgResponseTime}
                />

                <div className="overflow-hidden">
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        Issues Activity: <span className='text-teal-500'>Last 6 months</span>
                    </h3>
                    <IssuesTimelineChart timeline={analytics.timeline} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Labels Distribution */}
                    {analytics.topLabels.length > 0 && (
                        <div className="min-w-0 overflow-hidden">
                            <SectionHeader icon={Tags} title="Top Labels" />
                            <IssuesLabelsChart labels={analytics.topLabels} />
                        </div>
                    )}

                    {/* Top Issues */}
                    {analytics.hottestIssues.length > 0 && (
                        <div className="min-w-0 overflow-hidden">
                            <SectionHeader icon={ThermometerSun} title="Hottest Issues" />
                            <TopIssuesList issues={analytics.hottestIssues} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
