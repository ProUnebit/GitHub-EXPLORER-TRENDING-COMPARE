import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// ============================================
// VITEST GLOBAL SETUP
// ============================================

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
    useSearchParams: () => ({
        get: (key: string) => null,
    }),
    usePathname: () => '/',
}));

// MSW Server lifecycle
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
});

afterAll(() => {
    server.close();
});

// Mock window.scrollTo (для useInfiniteScroll тестов)
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
