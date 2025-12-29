'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ============================================
// PER PAGE SELECTOR - Client Component
// ============================================
// Dropdown для выбора количества результатов на странице
//
// Функционал:
// - Варианты: 20, 30, 50
// - При изменении вызывает callback
// - Визуально показывает текущий выбор
//
// Почему Client Component:
// - Интерактивность (onChange)
// - Select от shadcn требует 'use client'

type PerPageSelectorProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
};

const PER_PAGE_OPTIONS = [
    { value: 20, label: '20 per page' },
    { value: 30, label: '30 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
];

export function PerPageSelector({
    value,
    onChange,
    disabled = false,
}: PerPageSelectorProps) {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onChange(Number(val))}
            disabled={disabled}
        >
            <SelectTrigger className="w-38 bg-secondary cursor-pointer">
                <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
                {PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem
                        className='cursor-pointer'
                        key={option.value}
                        value={option.value.toString()}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
