import { describe, expect, test } from 'vitest'
import { render, screen, queryHelpers } from '@testing-library/react'
import CardValoration from '../cards/CardValoration'

describe('Card Valoration component', () => {
	test('Test title', () => {
		const container = render(
			<CardValoration title={'prueba'} valoration={5} comments={'blablacar'} />,
		)
		expect(screen.getByRole('heading', { level: 3, name: 'prueba' })).toBeDefined()
	})
	test('Test comments', () => {
		expect(screen.getByText('blablacar')).toBeDefined()
	})
})