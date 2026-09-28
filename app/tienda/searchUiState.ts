export interface SearchFallbackState {
    hasCompletedSearch: boolean;
    isSearching: boolean;
    resultCount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const shouldShowSearchFallback = ({
    hasCompletedSearch,
    isSearching,
    resultCount,
    status,
}: SearchFallbackState): boolean => (
    hasCompletedSearch &&
    !isSearching &&
    status === 'succeeded' &&
    resultCount === 0
);
