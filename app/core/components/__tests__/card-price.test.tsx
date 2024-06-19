import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardPrice from '../cards/CardPrice'

describe('CardPrice component', () => {
	test('Test Title', () => {
		render(<CardPrice title={'titulo'} description={'test'} reference={'12345'} price={500} />)
		expect(screen.getByRole('heading', { level: 4, name: 'titulo' })).toBeDefined()
	})
	test('Test description', () => {
		expect(screen.getByText('test')).toBeDefined()
	})
	test('Test Reference', () => {
		expect(screen.getByText('12345')).toBeDefined()
	})
	test('Test Price', () => {
		expect(screen.getByText('500€')).toBeDefined()
	})
	test('Test button shows up', () => {
		expect(screen.getByRole('button', { name: 'Comprar' })).toBeDefined()
	})
})