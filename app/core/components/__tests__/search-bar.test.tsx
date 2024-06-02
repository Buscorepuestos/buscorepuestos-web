import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import SearchBar from '../SearchBar'


describe('SearchBar component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Render Searchbar', () => {
		render(<SearchBar />)
		expect(screen.getByPlaceholderText('Escribe lo que necesitas')).toBeDefined()
	})
})