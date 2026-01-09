import Link from 'next/link';
import { GitCommit, GitGraph, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCommits } from '@/lib/github/api';
import { formatRelativeTime } from '@/lib/utils/formatters';

type RecentCommitsProps = {
    owner: string;
    name: string;
};

export async function RecentCommits({ owner, name }: RecentCommitsProps) {
    const commits = await getCommits(owner, name, 15);

    if (commits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Commits</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-8 text-center text-sm">
                        No commits data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='bg-card dark:border-teal-900/60'>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <GitGraph  className="mr-2 inline-block h-5 w-5 text-teal-500" />
                    <span className="font-bold text-teal-600 dark:text-amber-300/80">Recent Commits</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {commits.map((commit) => (
                        <div
                            key={commit.sha}
                            className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                        >
                            {/* Icon */}
                            <div className="mt-1 shrink-0">
                                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                    <GitCommit className="text-muted-foreground h-10 w-10" />
                                </div>
                            </div>

                            {/* Commit Info */}
                            <div className="min-w-0 flex-1">
                                {/* Commit Message */}
                                <p className="line-clamp-2 font-medium">
                                    {commit.commit.message.split('\n')[0]}
                                </p>

                                {/* Author & Time */}
                                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                                    {commit.author ? (
                                        <Link
                                            href={commit.author.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-foreground dark:text-amber-300/70 dark:hover:text-amber-300/90 transition-colors"
                                        >
                                            {commit.commit.author.name}
                                        </Link>
                                    ) : (
                                        <span>{commit.commit.author.name}</span>
                                    )}
                                    <span>•</span>
                                    <span>
                                        {formatRelativeTime(
                                            commit.commit.author.date
                                        )}
                                    </span>
                                </div>

                                {/* SHA & Link */}
                                <div className="mt-2 flex items-center gap-2">
                                    <code className="bg-muted rounded px-2 py-1 text-xs text-teal-700">
                                        {commit.sha.substring(0, 7)}
                                    </code>
                                    <Link
                                        href={commit.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                                    >
                                        View on GitHub
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-6 text-center">
                    <Link
                        href={`https://github.com/${owner}/${name}/commits`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                    >
                        View all commits
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
