import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';
import React from 'react';

// POLYFILLS FOR RADIX UI / TESTING

// PointerEvent polyfill
class MockPointerEvent extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly isPrimary: boolean;

    constructor(type: string, props: PointerEventInit = {}) {
        super(type, props);
        this.pointerId = props.pointerId ?? 0;
        this.pointerType = props.pointerType ?? 'mouse';
        this.isPrimary = props.isPrimary ?? true;
    }
}

// @ts-expect-error - Polyfill for testing
globalThis.PointerEvent = MockPointerEvent;

// hasPointerCapture polyfill (required by Radix UI)
if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
}

// scrollIntoView polyfill
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
}

// ResizeObserver polyfill
class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver;

// IntersectionObserver polyfill
class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(
        private callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit
    ) {}

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}
globalThis.IntersectionObserver = MockIntersectionObserver;

// window.scrollTo mock
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
});

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// NEXT.JS MOCKS

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
    useParams: () => ({}),
}));

vi.mock('next-view-transitions', () => ({
    Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
        return React.createElement('a', { href, ...props }, children);
    },
    useTransitionRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
}));

// TOAST MOCK

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
    },
    Toaster: () => null,
}));


// MSW SERVER LIFECYCLE

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    vi.clearAllMocks();
});

afterAll(() => {
    server.close();
});
