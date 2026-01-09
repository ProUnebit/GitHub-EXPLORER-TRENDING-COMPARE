type FeatureCardProps = {
    title: string;
    description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
    const cutSize = '35px';
    const polygon = `polygon(0 0, calc(100% - ${cutSize}) 0, 100% ${cutSize}, 100% 100%, ${cutSize} 100%, 0 calc(100% - ${cutSize}))`;
    return (
        <div className="relative p-px" style={{ clipPath: polygon }}>
            <div className="absolute inset-0 rounded-md bg-stone-300 dark:bg-teal-900/60" />
            <div
                className="bg-card relative rounded-md p-6 shadow-sm select-none"
                style={{ clipPath: polygon }}
            >
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-muted-foreground text-end text-sm">
                    {description}
                </p>
            </div>
        </div>
    );
}
