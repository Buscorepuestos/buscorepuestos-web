import { expect, test, describe, afterEach, beforeEach, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SearchBar from '../SearchBar'

const { useAutocompleteMock } = vi.hoisted(() => ({
	useAutocompleteMock: vi.fn(),
}))

vi.mock('../../../hooks/useAutocomplete', () => ({
	useAutocomplete: useAutocompleteMock,
}))

function mockMobileViewport(matches: boolean) {
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	})
}

describe('SearchBar component', () => {
	beforeEach(() => {
		mockMobileViewport(false)
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

	test('does not crash when the API provides a numeric reference', () => {
		useAutocompleteMock.mockReturnValue({
			results: {
				parts: [],
				categories: [],
				brands: [],
				references: [89004686],
			},
			isLoading: false,
			isOpen: true,
			closeDropdown: vi.fn(),
			openDropdown: vi.fn(),
			recentSearches: [],
			addRecentSearch: vi.fn(),
			clearRecentSearches: vi.fn(),
		})

		render(<SearchBar value="89004686" onChange={() => {}} />)
		fireEvent.focus(screen.getByRole('textbox'))

		expect(screen.getByText('89004686')).toBeDefined()
	})

	test('shows only two suggestions on mobile and expands the remaining results', () => {
		mockMobileViewport(true)
		useAutocompleteMock.mockReturnValue({
			results: {
				parts: [
					{ title: 'FARO DERECHO UNO', subcategory: 'FARO', brand: '', year: null, count: 1 },
					{ title: 'FARO DERECHO DOS', subcategory: 'FARO', brand: '', year: null, count: 1 },
					{ title: 'FARO DERECHO TRES', subcategory: 'FARO', brand: '', year: null, count: 1 },
					{ title: 'FARO DERECHO CUATRO', subcategory: 'FARO', brand: '', year: null, count: 1 },
				],
				categories: [],
				brands: [],
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

		render(<SearchBar value="faro derecho" onChange={() => {}} />)
		fireEvent.focus(screen.getByRole('textbox'))
		const findSuggestion = (title: string) => screen.queryByText(
			(_content, element) => element?.textContent === title,
			{ selector: 'div.text-sm' }
		)

		expect(findSuggestion('FARO DERECHO UNO')).not.toBeNull()
		expect(findSuggestion('FARO DERECHO DOS')).not.toBeNull()
		expect(findSuggestion('FARO DERECHO TRES')).toBeNull()

		const expandButton = screen.getByRole('button', { name: 'Ver 2 sugerencias más' })
		expect(expandButton.getAttribute('aria-expanded')).toBe('false')
		fireEvent.pointerDown(expandButton)

		expect(findSuggestion('FARO DERECHO TRES')).not.toBeNull()
		expect(findSuggestion('FARO DERECHO CUATRO')).not.toBeNull()
		expect(screen.getByRole('button', { name: 'Ver menos sugerencias' }).getAttribute('aria-expanded')).toBe('true')
	})
})
