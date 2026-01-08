// components/ui/section-header.tsx
import type { LucideIcon } from 'lucide-react';

type SectionHeaderProps = {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    className?: string;
};

/**
 * Переиспользуемый компонент для заголовков секций
 * 
 * Использование:
 * <SectionHeader 
 *   icon={MessageSquareText} 
 *   title="Issues Analytics"
 *   subtitle="Last 6 months" 
 * />
 */
export function SectionHeader({ 
    icon: Icon, 
    title, 
    subtitle,
    className = '' 
}: SectionHeaderProps) {
    return (
        <h3 className={`mb-3 flex items-center text-sm font-medium text-teal-600 dark:text-amber-300/80 ${className}`}>
            <Icon className="mr-2 h-4 w-4 text-teal-500" />
            {title}
            {subtitle && (
                <span className="ml-2 text-teal-500">
                    {subtitle}
                </span>
            )}
        </h3>
    );
}
