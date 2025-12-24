'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Plus, LoaderPinwheel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

// ============================================
// REPO SELECTOR - Client Component
// ============================================
// Управляет выбором репозиториев для сравнения
//
// Функционал:
// - Input для поиска репо (формат: owner/repo)
// - Добавление до 4 репо
// - Удаление репо
// - Обновление URL при изменении
//
// Паттерн: Controlled component with URL sync

const MAX_REPOS = 4;

type RepoSelectorProps = {
    selectedRepos: string[];
};

export function RepoSelector({ selectedRepos }: RepoSelectorProps) {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();

    // ============================================
    // URL UPDATE HELPER
    // ============================================
    const updateURL = (repos: string[]) => {
        const params = new URLSearchParams();
        if (repos.length > 0) {
            params.set('repos', repos.join(','));
        }

        startTransition(() => {
            const url =
                repos.length > 0 ? `/compare?${params.toString()}` : '/compare';
            router.push(url);
        });
    };

    // ============================================
    // HANDLERS
    // ============================================
    const handleAdd = () => {
        const trimmed = input.trim();

        // Валидация формата owner/repo
        if (!trimmed.includes('/')) {
            alert('Format should be: owner/repo (e.g., facebook/react)');
            return;
        }

        // Проверка на дубликаты
        if (selectedRepos.includes(trimmed)) {
            alert('Repository already added');
            return;
        }

        // Лимит репозиториев
        if (selectedRepos.length >= MAX_REPOS) {
            alert(`Maximum ${MAX_REPOS} repositories allowed`);
            return;
        }

        // Добавляем в список
        const newRepos = [...selectedRepos, trimmed];
        updateURL(newRepos);
        setInput('');
    };

    const handleRemove = (repo: string) => {
        const newRepos = selectedRepos.filter((r) => r !== repo);
        updateURL(newRepos);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-4">
            {/* Input Row */}
            <div className="flex gap-2">
                <div className="relative max-w-xl flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Enter repository (e.g., facebook/react)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={
                            isPending || selectedRepos.length >= MAX_REPOS
                        }
                        className="pl-10 font-semibold text-teal-600"
                    />
                </div>

                <Button
                    className="bg-slate-50 ring ring-stone-400 hover:cursor-pointer"
                    onClick={handleAdd}
                    disabled={
                        !input.trim() ||
                        isPending ||
                        selectedRepos.length >= MAX_REPOS
                    }
                >
                    {isPending ? (
                        <LoaderPinwheel className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                        </>
                    )}
                </Button>
            </div>

            {/* Selected Repos */}
            {selectedRepos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedRepos.map((repo) => (
                        <Badge
                            key={repo}
                            variant="secondary"
                            className="px-3 py-2 text-sm ring-2 ring-teal-400"
                        >
                            {repo}
                            <button
                                onClick={() => handleRemove(repo)}
                                disabled={isPending}
                                className="hover:text-destructive ml-2 transition-colors hover:cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}

                    {/* Counter */}
                    <Badge variant="outline" className="px-3 py-2 text-sm">
                        {selectedRepos.length} / {MAX_REPOS}
                    </Badge>
                </div>
            )}

            {/* Helper text */}
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                <Lightbulb className='w-4 h-4 text-amber-600' />
                <span>Tip: Try comparing popular frameworks like </span>
                <button
                    onClick={() => {
                        setInput('facebook/react');
                        setTimeout(() => handleAdd(), 100);
                    }}
                    className="text-teal-600 hover:underline"
                >
                    facebook/react
                </button>
                ,{' '}
                <button
                    onClick={() => {
                        setInput('vuejs/vue');
                        setTimeout(() => handleAdd(), 100);
                    }}
                    className="text-teal-600 hover:underline"
                >
                    vuejs/vue
                </button>
                , or{' '}
                <button
                    onClick={() => {
                        setInput('angular/angular');
                        setTimeout(() => handleAdd(), 100);
                    }}
                    className="text-teal-600 hover:underline"
                >
                    angular/angular
                </button>
            </p>
        </div>
    );
}
