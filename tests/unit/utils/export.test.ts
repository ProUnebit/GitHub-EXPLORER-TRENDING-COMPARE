// tests/unit/utils/export.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportRepoStatsToPDF, exportTrendingToCSV, exportComparisonToPDF, exportSearchResultsToCSV } from '@/lib/utils/export';

// Create mock document object for jsPDF
const mockDoc = {
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn().mockImplementation((text: string) => [text]),
    addPage: vi.fn(),
    setPage: vi.fn(),
    getNumberOfPages: vi.fn().mockReturnValue(1),
    save: vi.fn(),
    internal: { pageSize: { height: 297 } },
};

// Mock jsPDF using class syntax
vi.mock('jspdf', () => {
    return {
        default: class MockJsPDF {
            setFontSize = mockDoc.setFontSize;
            setTextColor = mockDoc.setTextColor;
            setFont = mockDoc.setFont;
            text = mockDoc.text;
            splitTextToSize = mockDoc.splitTextToSize;
            addPage = mockDoc.addPage;
            setPage = mockDoc.setPage;
            getNumberOfPages = mockDoc.getNumberOfPages;
            save = mockDoc.save;
            internal = mockDoc.internal;
        }
    };
});

vi.mock('papaparse', () => ({
    default: { unparse: vi.fn().mockImplementation(() => 'mocked,csv,data') },
}));

// Mock DOM methods
const mockClick = vi.fn();
const mockSetAttribute = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

describe('Export Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';

        // Mock URL methods
        global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
        global.URL.revokeObjectURL = vi.fn();

        // Mock document.createElement
        vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            return {
                tagName,
                setAttribute: mockSetAttribute,
                click: mockClick,
                style: {},
            } as unknown as HTMLElement;
        });

        vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
        vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
    });

    describe('exportRepoStatsToPDF', () => {
        it('should create PDF with all sections', () => {
            const mockData = {
                name: 'test',
                owner: 'owner',
                description: 'Test description',
                stars: 1000,
                forks: 500,
                watchers: 200,
                issues: 50,
                language: 'TypeScript',
                license: 'MIT',
                created: '2024-01-01',
                updated: '2 days ago',
                healthScore: {
                    score: 85,
                    grade: 'Good',
                    factors: { activity: 25, community: 28, maintenance: 18, documentation: 14 }
                },
                contributors: [{ login: 'user1', contributions: 100 }],
                languages: [{ name: 'TypeScript', percentage: 80 }],
                recentCommits: [{ message: 'Initial commit', author: 'user1', date: '2024-12-01' }],
                issuesAnalytics: {
                    total: 100,
                    open: 30,
                    closed: 70,
                    avgCloseTime: 5.5,
                    topLabels: [{ name: 'bug', count: 20, percentage: 20 }]
                },
                dependencies: { total: 50, prod: 30, dev: 20 }
            };

            // Should not throw
            expect(() => exportRepoStatsToPDF(mockData)).not.toThrow();
        });

        it('should handle null dependencies', () => {
            const mockData = {
                name: 'test',
                owner: 'owner',
                description: 'Test',
                stars: 1000,
                forks: 500,
                watchers: 200,
                issues: 50,
                language: 'TypeScript',
                license: 'MIT',
                created: '2024-01-01',
                updated: '2 days ago',
                healthScore: {
                    score: 85,
                    grade: 'Good',
                    factors: { activity: 25, community: 28, maintenance: 18, documentation: 14 }
                },
                contributors: [],
                languages: [],
                recentCommits: [],
                issuesAnalytics: {
                    total: 0,
                    open: 0,
                    closed: 0,
                    avgCloseTime: 0,
                    topLabels: []
                },
                dependencies: null
            };

            expect(() => exportRepoStatsToPDF(mockData)).not.toThrow();
        });
    });

    describe('exportComparisonToPDF', () => {
        it('should create comparison PDF', () => {
            const mockData = {
                repos: [
                    {
                        name: 'react',
                        owner: 'facebook',
                        stars: 220000,
                        forks: 45000,
                        watchers: 6500,
                        issues: 800,
                        contributors: 1500,
                        languages: 5,
                        created: '2013-05-24',
                        license: 'MIT',
                    },
                ]
            };

            expect(() => exportComparisonToPDF(mockData)).not.toThrow();
        });
    });

    describe('exportTrendingToCSV', () => {
        it('should create CSV file for trending repos', () => {
            const mockData = {
                repos: [
                    {
                        rank: 1,
                        name: 'react',
                        owner: 'facebook',
                        description: 'A library for UIs',
                        stars: 220000,
                        forks: 45000,
                        language: 'JavaScript',
                        url: 'https://github.com/facebook/react',
                    }
                ],
                since: 'weekly'
            };

            expect(() => exportTrendingToCSV(mockData)).not.toThrow();
            expect(mockClick).toHaveBeenCalled();
        });

        it('should include language in filename when provided', () => {
            const mockData = {
                repos: [],
                since: 'daily',
                language: 'TypeScript'
            };

            exportTrendingToCSV(mockData);

            // Check that setAttribute was called with download attribute containing language
            expect(mockSetAttribute).toHaveBeenCalledWith(
                'download',
                expect.stringContaining('typescript')
            );
        });
    });

    describe('exportSearchResultsToCSV', () => {
        it('should create CSV file for search results', () => {
            const mockData = {
                repos: [
                    {
                        name: 'react',
                        owner: 'facebook',
                        description: 'A library',
                        stars: 220000,
                        forks: 45000,
                        watchers: 6500,
                        language: 'JavaScript',
                        url: 'https://github.com/facebook/react',
                    }
                ],
                query: 'react'
            };

            expect(() => exportSearchResultsToCSV(mockData)).not.toThrow();
            expect(mockClick).toHaveBeenCalled();
        });

        it('should include query in filename', () => {
            const mockData = {
                repos: [],
                query: 'test-query'
            };

            exportSearchResultsToCSV(mockData);

            expect(mockSetAttribute).toHaveBeenCalledWith(
                'download',
                expect.stringContaining('test-query')
            );
        });
    });
});
