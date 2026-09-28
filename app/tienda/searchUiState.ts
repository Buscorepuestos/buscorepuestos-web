export interface SearchFallbackState {
    hasCompletedSearch: boolean;
    isSearching: boolean;
    resultCount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export type ProductSortOrder = 'asc' | 'desc' | 'proximity' | null;

export const parseProductSortOrder = (value: string): ProductSortOrder => {
    if (value === 'asc' || value === 'desc' || value === 'proximity') return value;
    return null;
};

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
