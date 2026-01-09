import { describe, it, expect } from 'vitest';
import { LANGUAGE_COLORS, getLanguageColor } from '@/lib/constants/language-colors';

// LANGUAGE COLORS TESTS

describe('LANGUAGE_COLORS', () => {

    // POPULAR LANGUAGES

    describe('popular languages', () => {
        it('has JavaScript color', () => {
            expect(LANGUAGE_COLORS.JavaScript).toBe('#f1e05a');
        });

        it('has TypeScript color', () => {
            expect(LANGUAGE_COLORS.TypeScript).toBe('#3178c6');
        });

        it('has Python color', () => {
            expect(LANGUAGE_COLORS.Python).toBe('#3572A5');
        });

        it('has Java color', () => {
            expect(LANGUAGE_COLORS.Java).toBe('#b07219');
        });

        it('has Go color', () => {
            expect(LANGUAGE_COLORS.Go).toBe('#00ADD8');
        });

        it('has Rust color', () => {
            expect(LANGUAGE_COLORS.Rust).toBe('#dea584');
        });
    });

    // C FAMILY LANGUAGES

    describe('C family languages', () => {
        it('has C color', () => {
            expect(LANGUAGE_COLORS.C).toBe('#555555');
        });

        it('has C++ color', () => {
            expect(LANGUAGE_COLORS['C++']).toBe('#f34b7d');
        });

        it('has C# color', () => {
            expect(LANGUAGE_COLORS['C#']).toBe('#178600');
        });
    });

    // FUNCTIONAL LANGUAGES

    describe('functional languages', () => {
        it('has F# color', () => {
            expect(LANGUAGE_COLORS['F#']).toBe('#b845fc');
        });

        it('has Haskell color', () => {
            expect(LANGUAGE_COLORS.Haskell).toBe('#5e5086');
        });

        it('has Elixir color', () => {
            expect(LANGUAGE_COLORS.Elixir).toBe('#6e4a7e');
        });

        it('has Erlang color', () => {
            expect(LANGUAGE_COLORS.Erlang).toBe('#B83998');
        });

        it('has Scala color', () => {
            expect(LANGUAGE_COLORS.Scala).toBe('#c22d40');
        });

        it('has Clojure color', () => {
            expect(LANGUAGE_COLORS.Clojure).toBe('#db5855');
        });
    });

    // MOBILE LANGUAGES

    describe('mobile languages', () => {
        it('has Swift color', () => {
            expect(LANGUAGE_COLORS.Swift).toBe('#ffac45');
        });

        it('has Kotlin color', () => {
            expect(LANGUAGE_COLORS.Kotlin).toBe('#A97BFF');
        });

        it('has Dart color', () => {
            expect(LANGUAGE_COLORS.Dart).toBe('#00B4AB');
        });

        it('has Objective-C color', () => {
            expect(LANGUAGE_COLORS['Objective-C']).toBe('#438eff');
        });
    });

    // WEB LANGUAGES

    describe('web languages', () => {
        it('has Ruby color', () => {
            expect(LANGUAGE_COLORS.Ruby).toBe('#701516');
        });

        it('has PHP color', () => {
            expect(LANGUAGE_COLORS.PHP).toBe('#4F5D95');
        });

        it('has HTML color', () => {
            expect(LANGUAGE_COLORS.HTML).toBe('#e34c26');
        });

        it('has CSS color', () => {
            expect(LANGUAGE_COLORS.CSS).toBe('#563d7c');
        });

        it('has SCSS color', () => {
            expect(LANGUAGE_COLORS.SCSS).toBe('#c6538c');
        });
    });

    // FALLBACK

    describe('fallback', () => {
        it('has Unknown fallback color', () => {
            expect(LANGUAGE_COLORS.Unknown).toBe('#8b5cf6');
        });
    });

    // ALL COLORS ARE VALID HEX

    describe('color format validation', () => {
        it('all colors are valid hex codes', () => {
            const hexRegex = /^#[0-9a-fA-F]{6}$/;

            Object.entries(LANGUAGE_COLORS).forEach(([language, color]) => {
                expect(color).toMatch(hexRegex);
            });
        });
    });
});

// getLanguageColor FUNCTION TESTS

describe('getLanguageColor', () => {

    // KNOWN LANGUAGES

    describe('known languages', () => {
        it('returns correct color for JavaScript', () => {
            expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
        });

        it('returns correct color for TypeScript', () => {
            expect(getLanguageColor('TypeScript')).toBe('#3178c6');
        });

        it('returns correct color for Python', () => {
            expect(getLanguageColor('Python')).toBe('#3572A5');
        });

        it('returns correct color for C++', () => {
            expect(getLanguageColor('C++')).toBe('#f34b7d');
        });

        it('returns correct color for C#', () => {
            expect(getLanguageColor('C#')).toBe('#178600');
        });
    });

    // UNKNOWN LANGUAGES

    describe('unknown languages', () => {
        it('returns fallback color for unknown language', () => {
            expect(getLanguageColor('SomeRandomLanguage')).toBe('#8b5cf6');
        });

        it('returns fallback color for empty string', () => {
            expect(getLanguageColor('')).toBe('#8b5cf6');
        });

        it('returns fallback color for null', () => {
            expect(getLanguageColor(null)).toBe('#8b5cf6');
        });

        it('returns fallback color for undefined', () => {
            expect(getLanguageColor(undefined)).toBe('#8b5cf6');
        });
    });

    // CASE SENSITIVITY

    describe('case sensitivity', () => {
        it('is case sensitive - lowercase does not match', () => {
            // The function is case-sensitive, so lowercase won't match
            expect(getLanguageColor('javascript')).toBe('#8b5cf6');
        });

        it('is case sensitive - uppercase does not match', () => {
            expect(getLanguageColor('JAVASCRIPT')).toBe('#8b5cf6');
        });

        it('exact case matches correctly', () => {
            expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
        });
    });
});
