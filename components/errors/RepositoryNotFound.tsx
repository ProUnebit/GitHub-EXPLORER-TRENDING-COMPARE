import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchX, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';

type RepositoryNotFoundProps = {
    owner?: string;
    repo?: string;
};

export function RepositoryNotFound({ owner, repo }: RepositoryNotFoundProps) {
    const repoName = owner && repo ? `${owner}/${repo}` : 'Repository';

    return (
        <div className="container mx-auto py-20">
            <Card className="max-w-2xl mx-auto border-red-500/50 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <SearchX className="h-8 w-8 text-red-500" />
                        <div>
                            <CardTitle className="text-2xl">Repository Not Found</CardTitle>
                            <CardDescription>
                                We couldn&apos;t find {repoName}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Repository Name */}
                    {owner && repo && (
                        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                            <p className="font-mono text-sm text-muted-foreground">
                                {owner}/{repo}
                            </p>
                        </div>
                    )}

                    {/* Possible Reasons */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Possible reasons:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
                            <li>The repository doesn&apos;t exist</li>
                            <li>The repository name or owner is misspelled</li>
                            <li>
                                <Lock className="inline h-3 w-3 mr-1" />
                                The repository is private and requires authentication
                            </li>
                            <li>The repository was deleted or renamed</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            asChild
                            className="flex-1"
                        >
                            <Link href="/">
                                Back to Search
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex-1"
                        >
                            <a
                                href="https://github.com/search"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Search on GitHub
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
