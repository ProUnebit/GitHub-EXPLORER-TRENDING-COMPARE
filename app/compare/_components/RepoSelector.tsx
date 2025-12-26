'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Plus, LoaderPinwheel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MAX_REPOS = 4;

type RepoSelectorProps = {
    selectedRepos: string[];
};

export function RepoSelector({ selectedRepos }: RepoSelectorProps) {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();

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

    const handleAdd = () => {
        const trimmed = input.trim();

        // Валидация формата owner/repo
        if (!trimmed.includes('/')) {
            toast.error('Invalid format', {
                description:
                    'Format should be: owner/repo (e.g., facebook/react)',
            });
            return;
        }

        // Проверка на правильный формат (один слэш)
        const parts = trimmed.split('/');
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            toast.error('Invalid format', {
                description:
                    'Format should be: owner/repo (e.g., facebook/react)',
            });
            return;
        }

        // Проверка на дубликаты
        if (selectedRepos.includes(trimmed)) {
            toast.warning('Already added', {
                description: `${trimmed} is already in the comparison list`,
            });
            return;
        }

        // Лимит репозиториев
        if (selectedRepos.length >= MAX_REPOS) {
            toast.error('Maximum limit reached', {
                description: `You can compare up to ${MAX_REPOS} repositories`,
            });
            return;
        }

        // Добавляем в список
        const newRepos = [...selectedRepos, trimmed];
        updateURL(newRepos);
        setInput('');

        // Успешное добавление
        toast.success('Repository added', {
            description: `${trimmed} added to comparison`,
        });
    };

    const handleRemove = (repo: string) => {
        const newRepos = selectedRepos.filter((r) => r !== repo);
        updateURL(newRepos);

        toast.info('Repository removed', {
            description: `${repo} removed from comparison`,
        });
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
                    className='hover:cursor-pointer ring ring-stone-300 hover:bg-slate-50 bg-stone-50 hover:ring-teal-400 transition-all'
                    onClick={handleAdd}
                    disabled={
                        !input.trim() ||
                        isPending ||
                        selectedRepos.length >= MAX_REPOS
                    }
                >
                    {isPending ? (
                        <LoaderPinwheel className="h-4 w-4 animate-spin text-teal-600" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4 text-teal-600" />
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
                                className="hover:text-destructive ml-2 transition-colors"
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
            <p className="text-muted-foreground text-xs">
                💡 Tip: Try comparing popular frameworks like{' '}
                <button
                    onClick={() => {
                        setInput('facebook/react');
                    }}
                    className="text-teal-600 hover:underline"
                >
                    facebook/react
                </button>
                ,{' '}
                <button
                    onClick={() => {
                        setInput('vuejs/vue');
                    }}
                    className="text-teal-600 hover:underline"
                >
                    vuejs/vue
                </button>
                ,{' '}
                <button
                    onClick={() => {
                        setInput('angular/angular');
                    }}
                    className="text-teal-600 hover:underline"
                >
                    angular/angular
                </button>
                {' '}or{' '}
                <button
                    onClick={() => {
                        setInput('sveltejs/svelte');
                    }}
                    className="text-teal-600 hover:underline"
                >
                    sveltejs/svelte
                </button>
            </p>
        </div>
    );
}
