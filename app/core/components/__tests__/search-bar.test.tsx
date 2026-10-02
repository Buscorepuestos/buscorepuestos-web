import { expect, test, describe, afterEach, beforeEach, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SearchBar from '../SearchBar'

const { useAutocompleteMock } = vi.hoisted(() => ({
	useAutocompleteMock: vi.fn(),
}))

vi.mock('../../../hooks/useAutocomplete', () => ({
	useAutocomplete: useAutocompleteMock,
}))

describe('SearchBar component', () => {
	beforeEach(() => {
		useAutocompleteMock.mockReturnValue({
			results: { parts: [], categories: [], brands: [], references: [] },
			isLoading: false,
			isOpen: false,
			closeDropdown: vi.fn(),
			openDropdown: vi.fn(),
			recentSearches: [],
			addRecentSearch: vi.fn(),
			clearRecentSearches: vi.fn(),
		})
	})

	afterEach(() => {
		cleanup()
	})
	test('Render Searchbar', () => {
		render(<SearchBar value="" onChange={() => {}} />)
		expect(screen.getByPlaceholderText('Busca piezas, referencias, marcas...')).toBeDefined()
	})

	test('keeps the input enabled while a search is loading', () => {
		const onChange = vi.fn()
		render(<SearchBar value="f" onChange={onChange} isLoading />)

		const input = screen.getByRole('textbox') as HTMLInputElement
		expect(input.disabled).toBe(false)

		fireEvent.change(input, { target: { value: 'fa' } })
		expect(onChange).toHaveBeenCalledOnce()
	})

	test('does not present unverified autocomplete counts as available stock', () => {
		useAutocompleteMock.mockReturnValue({
			results: {
				parts: [{
					title: 'ALERON TRASERO CITROEN C4 BERLINA',
					subcategory: 'ALERON TRASERO',
					brand: 'CITROEN',
					year: 2008,
					count: 5,
				}],
				categories: [{ name: 'ALERON TRASERO', count: 27 }],
				brands: [{ name: 'CITROEN', count: 19 }],
				references: [],
			},
			isLoading: false,
			isOpen: true,
			closeDropdown: vi.fn(),
			openDropdown: vi.fn(),
			recentSearches: [],
			addRecentSearch: vi.fn(),
			clearRecentSearches: vi.fn(),
		})

		render(<SearchBar value="aleron trasero" onChange={() => {}} />)
		fireEvent.focus(screen.getByRole('textbox'))

		expect(screen.getByText('Ver resultados para “aleron trasero” →')).toBeDefined()
		expect(screen.queryByText('5 disponibles')).toBeNull()
		expect(screen.queryByText('27 piezas disponibles')).toBeNull()
	})
})
