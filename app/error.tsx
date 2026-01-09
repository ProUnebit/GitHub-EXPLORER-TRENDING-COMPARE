'use client';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-destructive text-2xl font-bold">
                        Something went wrong!
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        {error.message ||
                            'An unexpected error occurred while fetching data.'}
                    </p>
                </div>

                <button
                    onClick={reset}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
                >
                    Try again
                </button>

                {/* Dev mode: показываем stack trace */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 w-full max-w-2xl text-left">
                        <summary className="text-muted-foreground cursor-pointer text-sm">
                            Error details (dev only)
                        </summary>
                        <pre className="bg-muted mt-2 overflow-auto rounded p-4 text-xs">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
