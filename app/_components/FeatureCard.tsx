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
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}