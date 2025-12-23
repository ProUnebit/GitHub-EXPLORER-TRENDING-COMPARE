'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// ============================================
// CHART.JS SETUP
// ============================================
// Регистрируем необходимые компоненты Chart.js
// Делается один раз при импорте модуля

ChartJS.register(ArcElement, Tooltip, Legend);

// ============================================
// LANGUAGE CHART CLIENT - Client Component
// ============================================
// Рендерит Chart.js график
// 
// Почему Client Component:
// - Chart.js использует Canvas API (только браузер)
// - Интерактивность (hover, tooltips)
// - Нельзя рендерить на сервере
// 
// Паттерн: Receive processed data, render visualization
// Server передал готовые данные, мы только рисуем

type LanguageData = {
  name: string;
  bytes: number;
  percentage: number;
};

type LanguageChartClientProps = {
  languages: LanguageData[];
};

// Цвета для языков (можно расширить)
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
};

export function LanguageChartClient({ languages }: LanguageChartClientProps) {
  // Берем топ-5 языков для читаемости
  const topLanguages = languages.slice(0, 5);
  
  // Подготавливаем данные для Chart.js
  const chartData = {
    labels: topLanguages.map((l) => l.name),
    datasets: [
      {
        data: topLanguages.map((l) => l.percentage),
        backgroundColor: topLanguages.map(
          (l) => LANGUAGE_COLORS[l.name] || '#8b5cf6'
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Конфигурация графика
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Doughnut data={chartData} options={options} />
      
      {/* Language List */}
      <div className="mt-6 space-y-2">
        {topLanguages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: LANGUAGE_COLORS[lang.name] || '#8b5cf6',
                }}
              />
              <span>{lang.name}</span>
            </div>
            <span className="text-muted-foreground">
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}