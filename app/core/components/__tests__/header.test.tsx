import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { Header } from '../global/header'

const principalMenuLinks = [
	{ label: 'Tienda', href: '#' },
	{ label: 'Quiénes somos', href: '#' },
	{ label: 'Ayuda', href: '#' },
	{ label: 'Contacto', href: '#' },
]
const secondaryMenuLinks = [
	{ label: 'Marcas', href: '#' },
	{ label: 'Categorías', href: '#' },
	{ label: 'Accesorios', href: '#' },
	{ label: 'Alumbrado', href: '#' },
	{ label: 'Cambio/Embrague', href: '#' },
	{ label: 'Carrocería', href: '#' },
	{ label: 'Climatización', href: '#' },
	{ label: 'Electricidad', href: '#' },
	{ label: 'Motor', href: '#' },
]

describe('Header component', () => {
	afterEach(() => {
		cleanup()
	})
	test('Slider content elements', () => {
		render(<Header />)
		// check if render img logo
		expect(screen.getByAltText('Header')).toBeDefined()

	})
	test('All menu links', () => {
		render(<Header />)
		const allLinks = [...principalMenuLinks, ...secondaryMenuLinks]

		allLinks.forEach(link => {
			expect(screen.getByText(link.label)).toBeDefined()
		})
	})
})