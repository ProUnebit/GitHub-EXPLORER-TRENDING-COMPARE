'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Rating } from '@/db/schema';

type RatingStarsProps = {
    value: number | string;
    onChange?: (rating: Rating) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
    allowHalf?: boolean;
};

const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
};

export function RatingStars({
    value,
    onChange,
    readonly = false,
    size = 'md',
    showNumber = false,
    allowHalf = false,
}: RatingStarsProps) {

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const handleClick = (
        starIndex: number,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (readonly || !onChange) return;

        let rating: Rating;

        if (allowHalf) {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const starWidth = rect.width;
            const isLeftHalf = clickX < starWidth / 2;

            rating = (isLeftHalf ? starIndex - 0.5 : starIndex) as Rating;
        } else {
            rating = starIndex as Rating;
        }

        onChange(rating);
    };

    const handleMouseMove = (
        starIndex: number,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (readonly || !allowHalf) {
            setHoveredRating(starIndex);
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const starWidth = rect.width;
        const isLeftHalf = mouseX < starWidth / 2;

        setHoveredRating(isLeftHalf ? starIndex - 0.5 : starIndex);
    };

    const handleMouseEnter = (starIndex: number) => {
        if (readonly) return;
        if (!allowHalf) {
            setHoveredRating(starIndex);
        }
    };

    const handleMouseLeave = () => {
        setHoveredRating(null);
    };

    // numericValue вместо value
    const displayRating = hoveredRating ?? numericValue;

    const getStarFillPercentage = (starIndex: number): number => {
        const diff = displayRating - starIndex + 1;

        if (diff >= 1) return 100;
        if (diff >= 0.5) return 50;
        return 0;
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className="flex items-center gap-1"
                onMouseLeave={handleMouseLeave}
                role="radiogroup"
                aria-label="Rating"
            >
                {[1, 2, 3, 4, 5].map((starIndex) => {
                    const fillPercentage = getStarFillPercentage(starIndex);

                    return (
                        <button
                            key={starIndex}
                            type="button"
                            onClick={(e) => handleClick(starIndex, e)}
                            onMouseEnter={() => handleMouseEnter(starIndex)}
                            onMouseMove={(e) => handleMouseMove(starIndex, e)}
                            disabled={readonly}
                            className={cn(
                                'relative transition-all duration-200',
                                !readonly && 'cursor-pointer hover:scale-110',
                                readonly && 'cursor-default'
                            )}
                            aria-label={`Rate ${starIndex} stars`}
                            role="radio"
                            aria-checked={
                                Math.floor(numericValue) === starIndex
                            }
                        >
                            <Star
                                className={cn(
                                    sizeMap[size],
                                    'fill-none text-gray-300 transition-colors'
                                )}
                            />

                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                                }}
                            >
                                <Star
                                    className={cn(
                                        sizeMap[size],
                                        'fill-yellow-400 text-yellow-400 transition-colors'
                                    )}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {showNumber && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {/* numericValue вместо displayRating */}
                    {numericValue.toFixed(1)}/5.0
                </span>
            )}
        </div>
    );
}
