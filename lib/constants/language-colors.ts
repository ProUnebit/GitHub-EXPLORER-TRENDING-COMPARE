
// Официальные цвета языков программирования от GitHub
// Source: https://github.com/ozh/github-colors

export const LANGUAGE_COLORS: Record<string, string> = {
    // Popular languages
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',

    // C family
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',

    // Functional
    'F#': '#b845fc',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Erlang: '#B83998',
    Scala: '#c22d40',
    Clojure: '#db5855',

    // System programming
    Zig: '#ec915c',
    Nim: '#ffc200',
    Crystal: '#000100',

    // Mobile
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    'Objective-C': '#438eff',

    // Web
    Ruby: '#701516',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',

    // Shell & scripting
    Shell: '#89e051',
    Lua: '#2134dd',
    Perl: '#0298c3',

    // JVM languages
    Groovy: '#4298b8',

    // Other
    R: '#198CE7',
    MATLAB: '#e16737',
    Julia: '#a270ba',
    Vue: '#41b883',

    // Fallback для неизвестных языков
    Unknown: '#8b5cf6',
};

// Helper функция для получения цвета языка
export function getLanguageColor(language: string | null | undefined): string {
    if (!language) return LANGUAGE_COLORS.Unknown;
    return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Unknown;
}
