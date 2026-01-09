import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DependencyAnalysis } from '@/app/repo/[owner]/[name]/_components/DependencyAnalysis';
import * as githubApi from '@/lib/github/api';

vi.mock('@/lib/github/api', () => ({
    getPackageJson: vi.fn(),
}));

describe('DependencyAnalysis', () => {
    it('should display total dependencies count', async () => {
        const mockPackageJson = {
            dependencies: { react: '^18.0.0', next: '^14.0.0' },
            devDependencies: { vitest: '^1.0.0' }
        };
        vi.mocked(githubApi.getPackageJson).mockResolvedValueOnce(mockPackageJson);

        render(await DependencyAnalysis({ owner: 'test', name: 'repo' }));
        // Component shows "X total" in a Badge
        expect(screen.getByText('3 total')).toBeInTheDocument();
    });

    it('should handle missing package.json', async () => {
        vi.mocked(githubApi.getPackageJson).mockResolvedValueOnce(null);
        render(await DependencyAnalysis({ owner: 'test', name: 'repo' }));
        // Component shows "No package.json found" not just "No package.json"
        expect(screen.getByText('No package.json found')).toBeInTheDocument();
    });

    it('should display production and dev counts separately', async () => {
        const mockPackageJson = {
            dependencies: { react: '^18.0.0' },
            devDependencies: { vitest: '^1.0.0', typescript: '^5.0.0' }
        };
        vi.mocked(githubApi.getPackageJson).mockResolvedValueOnce(mockPackageJson);

        render(await DependencyAnalysis({ owner: 'test', name: 'repo' }));
        expect(screen.getByText('Production')).toBeInTheDocument();
        expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('should show individual dependency names', async () => {
        const mockPackageJson = {
            dependencies: { react: '^18.0.0', next: '^14.0.0' },
            devDependencies: { vitest: '^1.0.0' }
        };
        vi.mocked(githubApi.getPackageJson).mockResolvedValueOnce(mockPackageJson);

        render(await DependencyAnalysis({ owner: 'test', name: 'repo' }));
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('next')).toBeInTheDocument();
        expect(screen.getByText('vitest')).toBeInTheDocument();
    });

    it('should display version numbers', async () => {
        const mockPackageJson = {
            dependencies: { react: '^18.0.0' },
            devDependencies: {}
        };
        vi.mocked(githubApi.getPackageJson).mockResolvedValueOnce(mockPackageJson);

        render(await DependencyAnalysis({ owner: 'test', name: 'repo' }));
        expect(screen.getByText('^18.0.0')).toBeInTheDocument();
    });
});
