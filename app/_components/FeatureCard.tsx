// ============================================
// FEATURE CARD - ПРОСТОЙ UI КОМПОНЕНТ
// ============================================
// Переиспользуемый UI блок
//
// Почему отдельный файл:
// - Single Responsibility (одна задача)
// - Легко стилизовать
// - Можно переиспользовать в других местах
// - Легко unit-тестировать

type FeatureCardProps = {
    title: string;
    description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <div className="bg-card dark:border-teal-900/60 rounded-lg border p-6 shadow-sm">
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );
}
