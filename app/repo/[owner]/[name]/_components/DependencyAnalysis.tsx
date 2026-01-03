import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertCircle } from 'lucide-react';
import { getPackageJson } from '@/lib/github/api';
import type { DependencyInfo } from '@/lib/github/types';

// ============================================
// DEPENDENCY ANALYSIS - Server Component
// ============================================
// Анализ зависимостей проекта из package.json
//
// Показывает:
// - Production dependencies
// - Dev dependencies
// - Общее количество
// - Версии пакетов

type DependencyAnalysisProps = {
    owner: string;
    name: string;
};

export async function DependencyAnalysis({
    owner,
    name,
}: DependencyAnalysisProps) {
    // ============================================
    // FETCH PACKAGE.JSON
    // ============================================
    const packageJson = await getPackageJson(owner, name);

    // Если package.json не найден (не npm проект)
    if (!packageJson) {
        return (
            <Card className="bg-card dark:border-teal-900/60">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Package className="mr-2 inline-block h-5 w-5 text-teal-500" />
                        <span className="font-bold text-teal-600 dark:text-amber-300/80">Dependencies</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="text-muted-foreground mb-2 h-12 w-12" />
                        <p className="text-muted-foreground text-sm">
                            No package.json found
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                            This might not be a Node.js project
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ============================================
    // PARSE DEPENDENCIES
    // ============================================
    const dependencies: DependencyInfo[] = [];

    // Production dependencies
    if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([name, version]) => {
            dependencies.push({
                name,
                version: version as string,
                type: 'production',
            });
        });
    }

    // Dev dependencies
    if (packageJson.devDependencies) {
        Object.entries(packageJson.devDependencies).forEach(
            ([name, version]) => {
                dependencies.push({
                    name,
                    version: version as string,
                    type: 'development',
                });
            }
        );
    }

    // Peer dependencies
    if (packageJson.peerDependencies) {
        Object.entries(packageJson.peerDependencies).forEach(
            ([name, version]) => {
                dependencies.push({
                    name,
                    version: version as string,
                    type: 'peer',
                });
            }
        );
    }

    // Optional dependencies
    if (packageJson.optionalDependencies) {
        Object.entries(packageJson.optionalDependencies).forEach(
            ([name, version]) => {
                dependencies.push({
                    name,
                    version: version as string,
                    type: 'optional',
                });
            }
        );
    }

    // ============================================
    // STATISTICS
    // ============================================
    const prodCount = dependencies.filter(
        (d) => d.type === 'production'
    ).length;
    const devCount = dependencies.filter(
        (d) => d.type === 'development'
    ).length;
    const totalCount = dependencies.length;

    // Группируем по типу
    const byType = {
        production: dependencies.filter((d) => d.type === 'production'),
        development: dependencies.filter((d) => d.type === 'development'),
        peer: dependencies.filter((d) => d.type === 'peer'),
        optional: dependencies.filter((d) => d.type === 'optional'),
    };

    return (
        <Card className="bg-card dark:border-teal-900/60">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Package className="mr-2 inline-block h-5 w-5 text-teal-500" />
                    <span className="font-bold text-teal-600 dark:text-amber-300/80">Dependencies</span>
                    <Badge variant="secondary" className="text-sm ml-auto">
                        {totalCount} total
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* ============================================
                    STATISTICS OVERVIEW
                    ============================================ */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-green-500/10 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {prodCount}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Production
                        </div>
                    </div>
                    <div className="rounded-lg border bg-blue-500/10 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {devCount}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Development
                        </div>
                    </div>
                </div>

                {/* ============================================
                    DEPENDENCIES LIST
                    ============================================ */}
                {/* Production Dependencies */}
                {byType.production.length > 0 && (
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">
                            Production Dependencies ({byType.production.length})
                        </h4>
                        <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                            {byType.production.map((dep) => (
                                <div
                                    key={dep.name}
                                    className="bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2"
                                >
                                    <span className="text-sm font-medium">
                                        {dep.name}
                                    </span>
                                    <code className="text-muted-foreground text-xs">
                                        {dep.version}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dev Dependencies */}
                {byType.development.length > 0 && (
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Development Dependencies (
                            {byType.development.length})
                        </h4>
                        <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                            {byType.development.map((dep) => (
                                <div
                                    key={dep.name}
                                    className="bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2"
                                >
                                    <span className="text-sm font-medium">
                                        {dep.name}
                                    </span>
                                    <code className="text-muted-foreground text-xs">
                                        {dep.version}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Peer Dependencies */}
                {byType.peer.length > 0 && (
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-purple-600 dark:text-purple-400">
                            Peer Dependencies ({byType.peer.length})
                        </h4>
                        <div className="space-y-2">
                            {byType.peer.map((dep) => (
                                <div
                                    key={dep.name}
                                    className="bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2"
                                >
                                    <span className="text-sm font-medium">
                                        {dep.name}
                                    </span>
                                    <code className="text-muted-foreground text-xs">
                                        {dep.version}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Project Info */}
                {packageJson.name && (
                    <div className="border-t pt-4">
                        <div className="text-muted-foreground text-center text-sm">
                            <span className="font-medium">
                                {packageJson.name}
                            </span>
                            {packageJson.version && (
                                <span className="ml-2">
                                    v{packageJson.version}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
