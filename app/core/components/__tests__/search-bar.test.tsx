import { expect, test, describe, afterEach, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import SearchBar from '../SearchBar'


describe('SearchBar component', () => {
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
})
