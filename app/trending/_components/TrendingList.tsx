import { getTrendingRepositories } from '@/lib/github/api';
import { TrendingListClient } from './TrendingListClient';
import { TrendingExportButton } from './TrendingExportButton';
import { TrendingLanguagesOverview } from './TrendingLanguagesOverview'; // ← Добавить

type TrendingListProps = {
    since: 'daily' | 'weekly' | 'monthly';
    language?: string;
};

export async function TrendingList({ since, language }: TrendingListProps) {
    const data = await getTrendingRepositories(language, since);

    if (data.items.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                    No trending repositories found
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Try different filters
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {' '}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-semibold">
                    <span className="font-bold text-teal-600">
                        {data.items.length}
                    </span>{' '}
                    trending{' '}
                    <span className="font-bold text-teal-600">
                        {language ? `${language} ` : ''}
                    </span>{' '}
                    repositories analyzed
                </p>

                <div className="flex justify-end">
                    <TrendingExportButton
                        repos={data.items}
                        since={since}
                        language={language}
                    />
                </div>
            </div>
            {/* Repository List */}
            {!language && <TrendingLanguagesOverview repos={data.items} />}
            <TrendingListClient repos={data.items} />
        </div>
    );
}
