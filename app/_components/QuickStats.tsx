
import { getTrendingRepositories } from '@/lib/github/api';
import { QuickStatsClient } from './QuickStatsClient';

// ============================================
// SERVER COMPONENT - data fetching
// ============================================

export async function QuickStats() {
    const data = await getTrendingRepositories('', 'daily');
    return <QuickStatsClient data={data} />;
}
