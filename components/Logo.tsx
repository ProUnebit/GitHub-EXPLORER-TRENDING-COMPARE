// components/Logo.tsx
import { cn } from '@/lib/utils/cn';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={cn('inline-block', className)}
            aria-label="GitHub Explorer Logo"
        >
            <defs>
                <radialGradient id="starGlow">
                    <stop
                        offset="0%"
                        style={{ stopColor: '#f97316', stopOpacity: 0.5 }}
                    />
                    <stop
                        offset="100%"
                        style={{ stopColor: '#f97316', stopOpacity: 0 }}
                    />
                </radialGradient>
                <linearGradient
                    id="starGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" style={{ stopColor: '#fbbf24' }} />
                    <stop offset="100%" style={{ stopColor: '#f97316' }} />
                </linearGradient>
            </defs>

            {/* Stars at the top-right (дальше и правее) */}

            {/* Large star (center-right, дальше) */}
            <g transform="translate(72, 12)">
                <circle r="9" fill="url(#starGlow)" opacity="0.4" />
                <path
                    d="M 0,-5.5 L 1.6,-1.7 L 5.7,-1.7 L 2.5,0.9 L 4,4.5 L 0,2 L -4,4.5 L -2.5,0.9 L -5.7,-1.7 L -1.6,-1.7 Z"
                    fill="url(#starGrad)"
                    stroke="#fbbf24"
                    strokeWidth="0.8"
                />
            </g>

            {/* Medium star top-right */}
            <g transform="translate(85, 8)">
                <circle r="6" fill="url(#starGlow)" opacity="0.35" />
                <path
                    d="M 0,-4 L 1.2,-1.2 L 4.1,-1.2 L 1.8,0.5 L 2.8,3.2 L 0,1.4 L -2.8,3.2 L -1.8,0.5 L -4.1,-1.2 L -1.2,-1.2 Z"
                    fill="url(#starGrad)"
                    stroke="#fbbf24"
                    strokeWidth="0.6"
                />
            </g>

            {/* Medium star mid-right */}
            <g transform="translate(78, 20)">
                <circle r="5" fill="url(#starGlow)" opacity="0.3" />
                <path
                    d="M 0,-3.5 L 1,-1.1 L 3.6,-1.1 L 1.6,0.5 L 2.5,2.9 L 0,1.3 L -2.5,2.9 L -1.6,0.5 L -3.6,-1.1 L -1,-1.1 Z"
                    fill="url(#starGrad)"
                    stroke="#fbbf24"
                    strokeWidth="0.5"
                />
            </g>

            {/* Small stars */}
            <g transform="translate(65, 6)">
                <path
                    d="M 0,-2.5 L 0.8,-0.8 L 2.6,-0.8 L 1.1,0.3 L 1.8,2 L 0,1.1 L -1.8,2 L -1.1,0.3 L -2.6,-0.8 L -0.8,-0.8 Z"
                    fill="#fbbf24"
                    opacity="0.8"
                />
            </g>

            <g transform="translate(90, 15)">
                <path
                    d="M 0,-2 L 0.6,-0.6 L 2,-0.6 L 0.9,0.2 L 1.4,1.6 L 0,0.8 L -1.4,1.6 L -0.9,0.2 L -2,-0.6 L -0.6,-0.6 Z"
                    fill="#f97316"
                    opacity="0.7"
                />
            </g>

            {/* Tiny background stars */}
            <circle cx="60" cy="10" r="0.8" fill="#94a3b8" opacity="0.6" />
            <circle cx="92" cy="12" r="0.7" fill="#94a3b8" opacity="0.5" />
            <circle cx="70" cy="3" r="0.6" fill="#94a3b8" opacity="0.5" />

            {/* Sight lines (от телескопа к звёздам справа-сверху) */}
            <line
                x1="50"
                y1="32"
                x2="72"
                y2="17"
                stroke="#fbbf24"
                strokeWidth="0.7"
                opacity="0.35"
                strokeDasharray="2,2"
            >
                <animate
                    attributeName="opacity"
                    values="0.25;0.55;0.25"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </line>
            <line
                x1="50"
                y1="32"
                x2="85"
                y2="12"
                stroke="#f97316"
                strokeWidth="0.5"
                opacity="0.28"
                strokeDasharray="1.5,1.5"
            >
                <animate
                    attributeName="opacity"
                    values="0.18;0.45;0.18"
                    dur="3.5s"
                    repeatCount="indefinite"
                />
            </line>
            <line
                x1="50"
                y1="32"
                x2="78"
                y2="24"
                stroke="#fbbf24"
                strokeWidth="0.5"
                opacity="0.28"
                strokeDasharray="1.5,1.5"
            >
                <animate
                    attributeName="opacity"
                    values="0.18;0.45;0.18"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </line>

            {/* TELESCOPE (повёрнут ВПРАВО-вверх, К звёздам) */}
            <g transform="translate(35, 70)">
                {/* Tripod legs */}
                <line
                    x1="-18"
                    y1="24"
                    x2="-5"
                    y2="0"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.95"
                />
                <line
                    x1="18"
                    y1="24"
                    x2="5"
                    y2="0"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.95"
                />
                <line
                    x1="0"
                    y1="28"
                    x2="0"
                    y2="0"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.95"
                />

                {/* Tripod feet */}
                <circle cx="-18" cy="24" r="3" fill="#ffffff" opacity="0.95" />
                <circle cx="18" cy="24" r="3" fill="#ffffff" opacity="0.95" />
                <circle cx="0" cy="28" r="3" fill="#ffffff" opacity="0.95" />

                {/* Mount point */}
                <circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                />

                {/* Telescope tube (повёрнут на +30° ВПРАВО-вверх, К звёздам) */}
                <g transform="rotate(30)">
                    {/* Main tube */}
                    <rect
                        x="-7"
                        y="-55"
                        width="14"
                        height="55"
                        rx="3"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1.8"
                        opacity="0.95"
                    />

                    {/* Tube detail lines (horizontal rings) */}
                    <line
                        x1="-7"
                        y1="-40"
                        x2="7"
                        y2="-40"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        opacity="0.5"
                    />
                    <line
                        x1="-7"
                        y1="-25"
                        x2="7"
                        y2="-25"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        opacity="0.5"
                    />
                    <line
                        x1="-7"
                        y1="-10"
                        x2="7"
                        y2="-10"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        opacity="0.5"
                    />

                    {/* Eyepiece (at bottom) */}
                    <ellipse
                        cx="0"
                        cy="0"
                        rx="6"
                        ry="5"
                        fill="#f1f5f9"
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                        opacity="0.95"
                    />
                    <circle cx="0" cy="0" r="3" fill="#cbd5e1" opacity="0.3" />

                    {/* Lens (at top - pointing to stars) */}
                    <circle
                        cx="0"
                        cy="-55"
                        r="6.5"
                        fill="#94a3b8"
                        opacity="0.5"
                    />
                    <circle
                        cx="0"
                        cy="-55"
                        r="4.5"
                        fill="#ffffff"
                        opacity="0.6"
                    />
                    <circle
                        cx="0"
                        cy="-55"
                        r="2"
                        fill="#cbd5e1"
                        opacity="0.4"
                    />

                    {/* Focus knobs (on sides) */}
                    <circle
                        cx="-9"
                        cy="-28"
                        r="3"
                        fill="#f1f5f9"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                        opacity="0.9"
                    />
                    <circle
                        cx="9"
                        cy="-28"
                        r="3"
                        fill="#f1f5f9"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                        opacity="0.9"
                    />

                    {/* Finder scope (маленький боковой прицел) */}
                    <rect
                        x="8"
                        y="-48"
                        width="3"
                        height="15"
                        rx="1.5"
                        fill="#e2e8f0"
                        stroke="#cbd5e1"
                        strokeWidth="0.8"
                        opacity="0.8"
                    />
                </g>
            </g>
        </svg>
    );
}
