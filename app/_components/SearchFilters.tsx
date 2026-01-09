'use client';

import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLanguageColor } from '@/lib/constants/language-colors';

type SearchFiltersProps = {
    language: string;
    minStars: string;
    onLanguageChange: (value: string) => void;
    onMinStarsChange: (value: string) => void;
    onClearFilters: () => void;
    disabled?: boolean;
};

const LANGUAGES = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'lua', label: 'Lua' },
    { value: 'r', label: 'R' },
    { value: 'webassembly', label: 'WebAssembly' },
    { value: 'shell', label: 'Shell' },
];

const STARS = [
    { value: '0', label: '⭐️0+' },
    { value: '50', label: '⭐️50+' },
    { value: '100', label: '⭐️100+' },
    { value: '200', label: '⭐️200+' },
    { value: '500', label: '⭐️500+' },
    { value: '1000', label: '⭐️1000+' },
    { value: '5000', label: '⭐️5000+' },
    { value: '10000', label: '⭐️10000+' },
    { value: '20000', label: '⭐️20000+' },
    { value: '50000', label: '⭐️50000+' },
    { value: '100000', label: '⭐️100000+' },
];

export function SearchFilters({
    language,
    minStars,
    onLanguageChange,
    onMinStarsChange,
    onClearFilters,
    disabled = false,
}: SearchFiltersProps) {

    const hasActiveFilters = language !== '' || minStars !== '';

    const languageLabel = LANGUAGES.find((l) => l.value === language)?.label;

    return (
        <div className="space-y-3">
            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-2">
                {/* Language Filter */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="language" className="text-muted-foreground">
                        Language
                    </Label>
                    <Select
                        value={language}
                        onValueChange={onLanguageChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id="language"
                            className="bg-secondary w-38 cursor-pointer"
                        >
                            <SelectValue placeholder="All Languages" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map((item, i) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                    className="cursor-pointer font-semibold"
                                    style={{
                                        color:
                                            i === 0
                                                ? 'smokewhite'
                                                : getLanguageColor(item.label),
                                    }}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Min Stars Filter */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="minStars" className="text-muted-foreground">
                        Stars
                    </Label>
                    <Select
                        value={minStars}
                        onValueChange={onMinStarsChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id="minStars"
                            className="bg-secondary w-34 cursor-pointer"
                        >
                            <SelectValue placeholder="⭐️0+" />
                        </SelectTrigger>
                        <SelectContent>
                            {STARS.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                    className="cursor-pointer"
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        disabled={disabled}
                        className="ring ring-orange-500 hover:cursor-pointer ml-auto"
                    >
                        <X className="mr-1 h-3 w-3 text-orange-500" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Active Filters Badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs font-medium select-none">
                        Active filters:
                    </span>

                    {/* Language Badge */}
                    {language && (
                        <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 text-xs"
                        >
                            Language:{' '}
                            <span
                                className="font-semibold"
                                style={{
                                    color: getLanguageColor(languageLabel),
                                }}
                            >
                                {languageLabel}
                            </span>
                            <button
                                type="button"
                                onClick={() => onLanguageChange('')}
                                disabled={disabled}
                                className="hover:bg-muted ml-1 rounded-sm transition-colors"
                            >
                                <X className="h-3 w-3 cursor-pointer transition-colors hover:text-orange-500" />
                            </button>
                        </Badge>
                    )}

                    {/* Min Stars Badge */}
                    {minStars && (
                        <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 text-xs"
                        >
                            Stars:{' '}
                            <span className="text-amber-500 dark:text-amber-300/80 font-semibold">{minStars}+</span>
                            <button
                                type="button"
                                onClick={() => onMinStarsChange('')}
                                disabled={disabled}
                                className="hover:bg-muted ml-1 rounded-sm transition-colors"
                            >
                                <X className="h-3 w-3 cursor-pointer transition-colors hover:text-orange-500" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
