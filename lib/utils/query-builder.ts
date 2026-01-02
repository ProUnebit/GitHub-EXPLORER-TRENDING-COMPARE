/**
 * Строит GitHub API query string с фильтрами
 */
export function buildSearchQuery(params: {
    query: string;
    language?: string;
    minStars?: string;
}): string {
    let searchQuery = params.query;

    if (params.language) {
        searchQuery += ` language:${params.language}`;
    }

    if (params.minStars && parseInt(params.minStars) > 0) {
        searchQuery += ` stars:>=${params.minStars}`;
    }

    return searchQuery;
}
