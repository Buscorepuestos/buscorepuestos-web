import { describe, expect, test } from 'vitest'
import reducer, { buildProductSearchParams, fetchProducts } from '../../../redux/features/productSearchSlice'
import { parseProductSortOrder, shouldShowSearchFallback } from '../../../tienda/searchUiState'

const pending = (requestId: string, searchTerm: string) => ({
    type: fetchProducts.pending.type,
    meta: { requestId, arg: { searchTerm } },
})

const fulfilled = (requestId: string, searchTerm: string, data: unknown[]) => ({
    type: fetchProducts.fulfilled.type,
    payload: { data, totalPages: data.length > 0 ? 1 : 0 },
    meta: { requestId, arg: { searchTerm } },
})

describe('product search request state', () => {
    test('ignores a stale response when a newer search is active', () => {
        let state = reducer(undefined, { type: '@@init' })

        state = reducer(state, pending('old-request', 'faro'))
        state = reducer(state, pending('new-request', 'alternador'))
        state = reducer(state, fulfilled('old-request', 'faro', [{ _id: 'old' }]))

        expect(state.loading).toBe(true)
        expect(state.searchResults).toEqual([])
        expect(state.currentRequestId).toBe('new-request')

        state = reducer(state, fulfilled('new-request', 'alternador', [{ _id: 'new' }]))

        expect(state.loading).toBe(false)
        expect(state.status).toBe('succeeded')
        expect(state.hasCompletedSearch).toBe(true)
        expect(state.searchResults).toEqual([{ _id: 'new' }])
    })

    test('marks an empty explicit search as completed', () => {
        let state = reducer(undefined, pending('request', 'referencia inexistente'))
        state = reducer(state, fulfilled('request', 'referencia inexistente', []))

        expect(state.status).toBe('succeeded')
        expect(state.hasCompletedSearch).toBe(true)
        expect(state.searchResults).toEqual([])
    })
})

describe('search fallback visibility', () => {
    test.each([
        ['before searching', false, false, 'idle', 0],
        ['while searching', false, true, 'loading', 0],
        ['when the request fails', false, false, 'failed', 0],
        ['when results exist', false, false, 'succeeded', 1],
        ['after a confirmed empty search', true, false, 'succeeded', 0],
    ] as const)('%s', (_label, expected, isSearching, status, resultCount) => {
        expect(shouldShowSearchFallback({
            hasCompletedSearch: status === 'succeeded',
            isSearching,
            resultCount,
            status,
        })).toBe(expected)
    })
})

describe('product result ordering', () => {
    test.each([
        ['', null],
        ['unknown', null],
        ['asc', 'asc'],
        ['desc', 'desc'],
        ['proximity', 'proximity'],
    ] as const)('maps %s to a supported sort order', (value, expected) => {
        expect(parseProductSortOrder(value)).toBe(expected)
    })
})

describe('product search pagination', () => {
	test('removes separators from references only in the API query', () => {
		const params = buildProductSearchParams({
			searchTerm: 'SLV77 00110 484',
			page: 1,
		})

		expect(params.get('q')).toBe('SLV7700110484')
	})

	test('normalizes punctuation and casing in text searches sent to the API', () => {
		const params = buildProductSearchParams({
			searchTerm: '  mo.tor---BMW  ',
			page: 1,
		})

		expect(params.get('q')).toBe('motor bmw')
	})

    test('sends the selected page together with the active search and filters', () => {
        const params = buildProductSearchParams({
            searchTerm: 'faro',
            page: 3,
            subcategory: 'faro derecho',
            brand: 'BMW',
            model: 'E87',
            year: 2010,
        })

        expect(params.get('q')).toBe('faro')
        expect(params.get('page')).toBe('3')
        expect(params.get('subcategory')).toBe('faro derecho')
        expect(params.get('brand')).toBe('BMW')
        expect(params.get('model')).toBe('E87')
        expect(params.get('year')).toBe('2010')
    })

    test('sends active filters when browsing the catalog without a search term', () => {
        const params = buildProductSearchParams({
            page: 2,
            subcategory: 'Alumbrado',
            brand: 'BMW',
            model: 'E87',
            year: 2008,
        })

        expect(params.get('q')).toBeNull()
        expect(params.get('page')).toBe('2')
        expect(params.get('subcategory')).toBe('Alumbrado')
        expect(params.get('brand')).toBe('BMW')
        expect(params.get('model')).toBe('E87')
        expect(params.get('year')).toBe('2008')
    })
})
