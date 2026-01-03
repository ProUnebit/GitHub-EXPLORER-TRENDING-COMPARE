import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                pathname: '/**',
            },
        ],
    },

    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================

    // Experimental: optimizePackageImports
    // Автоматически оптимизирует импорты из больших библиотек
    experimental: {
        optimizePackageImports: ['lucide-react', 'chart.js', 'react-chartjs-2'],
    },

    // Compression
    compress: true,

    // Оптимизация production build
    productionBrowserSourceMaps: false, // Отключаем source maps в production
};

export default nextConfig;
