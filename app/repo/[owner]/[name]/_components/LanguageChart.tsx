import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLanguages } from '@/lib/github/api';
import { calculateLanguagePercentages } from '@/lib/utils/formatters';
import { LanguageChartClient } from './LanguageChartClient';

// ============================================
// LANGUAGE CHART - Server Component
// ============================================
// Фетчит данные о языках на сервере
// Передает в Client Component для рендера графика
//
// Паттерн: Server fetches → Client renders
// Почему:
// - Fetch на сервере (без CORS, с кешем)
// - Chart.js требует Canvas API (только в браузере)
// - Разделение ответственности

type LanguageChartProps = {
    owner: string;
    name: string;
};

export async function LanguageChart({ owner, name }: LanguageChartProps) {
    // Data fetching на сервере
    const languages = await getLanguages(owner, name);

    // Обработка edge case
    if (Object.keys(languages).length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-8 text-center text-sm">
                        No language data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Вычисляем проценты
    const languageData = calculateLanguagePercentages(languages);

    // Передаем данные в Client Component
    return (
        <Card className='bg-card dark:border-teal-900/60'>
            <CardHeader>
                <CardTitle className='text-teal-600 dark:text-amber-300/80'>Languages</CardTitle>
            </CardHeader>
            <CardContent>
                <LanguageChartClient languages={languageData} />
            </CardContent>
        </Card>
    );
}
