import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Button from '../Button'


describe('Button component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Default primary button', () => {
		render(<Button />)
		expect(screen.getByRole('button', { name: 'Comprar' })).toBeDefined()
	})
	test('Secondary button', () => {
		render(<Button type="secondary" />)
		expect(screen.getByRole('button', { name: 'Comprar' })).toBeDefined()
	})
	test('Passing a label name', () => {
		render(<Button labelName="prueba" type="secondary" />)
		expect(screen.getByRole('button', { name: 'prueba' })).toBeDefined()
	})
})
