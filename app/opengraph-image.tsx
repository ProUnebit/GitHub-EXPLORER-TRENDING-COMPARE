import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GitHub Explorer Dashboard';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #14b8a6 100%)',
                fontFamily: 'Inter',
            }}
        >
            {/* Icon */}
            <div
                style={{
                    display: 'flex',
                    fontSize: 120,
                    marginBottom: 40,
                }}
            >
                🔭
            </div>

            {/* Title */}
            <div
                style={{
                    fontSize: 80,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 20,
                }}
            >
                GitHub Explorer
            </div>

            {/* Subtitle */}
            <div
                style={{
                    fontSize: 40,
                    color: '#cbd5e1',
                    textAlign: 'center',
                    maxWidth: 900,
                }}
            >
                Advanced repository analytics, trending repos, and comparison
                tools
            </div>

            {/* Stats */}
            <div
                style={{
                    display: 'flex',
                    gap: 60,
                    marginTop: 60,
                    fontSize: 28,
                    color: '#94a3b8',
                }}
            >
                <div>⭐ Search</div>
                <div>🔥 Trending</div>
                <div>📊 Compare</div>
                <div>📈 Analytics</div>
            </div>
        </div>,
        {
            ...size,
        }
    );
}
