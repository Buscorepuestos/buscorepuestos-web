import { vi } from 'vitest';

export const useRouter = vi.fn(() => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
}));
