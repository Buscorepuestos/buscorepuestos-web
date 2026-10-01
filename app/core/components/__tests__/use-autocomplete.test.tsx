import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useAutocomplete } from '../../../hooks/useAutocomplete'
import type { AutocompleteResults } from '../../../services/products/products.service'

const { getAutocompleteMock } = vi.hoisted(() => ({
    getAutocompleteMock: vi.fn(),
}))

vi.mock('../../../services/products/products.service', async importOriginal => {
    const original = await importOriginal<typeof import('../../../services/products/products.service')>()
    return {
        ...original,
        getAutocomplete: getAutocompleteMock,
    }
})

const autocompleteResult = (title: string): AutocompleteResults => ({
    parts: [{ title, subcategory: 'Alumbrado', brand: '', year: null, count: 1 }],
    categories: [],
    brands: [],
    references: [],
})

describe('useAutocomplete', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        getAutocompleteMock.mockReset()
        sessionStorage.clear()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    test('waits for the debounce before requesting suggestions', async () => {
        getAutocompleteMock.mockResolvedValue(autocompleteResult('Faro delantero'))
        const { rerender } = renderHook(({ query }) => useAutocomplete(query), {
            initialProps: { query: 'f' },
        })

        rerender({ query: 'fa' })
        act(() => vi.advanceTimersByTime(299))
        expect(getAutocompleteMock).not.toHaveBeenCalled()

        await act(async () => vi.advanceTimersByTime(1))
        expect(getAutocompleteMock).toHaveBeenCalledOnce()
        expect(getAutocompleteMock).toHaveBeenCalledWith('fa', expect.any(AbortSignal))
    })

    test('aborts and ignores an older request when the query changes', async () => {
        let resolveFirst!: (value: AutocompleteResults) => void
        const firstRequest = new Promise<AutocompleteResults>(resolve => { resolveFirst = resolve })
        getAutocompleteMock
            .mockReturnValueOnce(firstRequest)
            .mockResolvedValueOnce(autocompleteResult('Faro BMW'))

        const { result, rerender } = renderHook(({ query }) => useAutocomplete(query), {
            initialProps: { query: 'fa' },
        })

        await act(async () => vi.advanceTimersByTime(300))
        const firstSignal = getAutocompleteMock.mock.calls[0][1] as AbortSignal

        rerender({ query: 'faro' })
        expect(firstSignal.aborted).toBe(true)
        await act(async () => {
            vi.advanceTimersByTime(300)
            await Promise.resolve()
        })
        expect(result.current.results.parts[0]?.title).toBe('Faro BMW')

        await act(async () => resolveFirst(autocompleteResult('Resultado obsoleto')))
        expect(result.current.results.parts[0]?.title).toBe('Faro BMW')
    })
})
