
import { getTrendingRepositories } from '@/lib/github/api';
import { QuickStatsClient } from './QuickStatsClient';

export async function QuickStats() {
    const data = await getTrendingRepositories('', 'daily');
    return <QuickStatsClient data={data} />;
}
