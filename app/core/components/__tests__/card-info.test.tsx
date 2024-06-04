import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardInfo from '../cards/CardInfo'

describe('Banner image component', () => {
	test('Background url renders', () => {
		const { container } = render(
			<CardInfo title="Prueba" />,
		)
		expect(screen.getByRole('heading', { level: 4, name: 'Prueba' })).toBeDefined()
	})
})