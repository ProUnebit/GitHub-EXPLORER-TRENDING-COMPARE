import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        pool: 'forks',
        // Это критически важно для MSW и React 19
        server: {
            deps: {
                inline: [/msw/, 'parse5', 'undici'],
            },
        },
        // Увеличиваем таймаут, чтобы увидеть реальную ошибку, а не просто висеть
        testTimeout: 10000,
        hookTimeout: 10000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
