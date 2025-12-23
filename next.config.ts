import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        // Разрешаем загрузку изображений с GitHub
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
};

export default nextConfig;
