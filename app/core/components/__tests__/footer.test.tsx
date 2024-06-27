import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { Footer } from '../global/footer'

const footerLinks = [
	{
		category: 'TE PUEDE INTERESAR',
		links: [
			{ name: 'Outlet', href: '#' },
			{ name: 'Más buscados', href: '#' },
			{ name: 'Servicios', href: '#' },
			{ name: 'Partners', href: '#' },
		],
	},
	{
		category: 'PÁGINAS RECIENTES',
		links: [
			{ name: 'Tienda', href: '#' },
			{ name: 'Menú', href: '#' },
			{ name: 'Quienes somos', href: '#' },
			{ name: 'Contacto', href: '#' },
		],
	},
	{
		category: 'MÁS INFORMACIÓN',
		links: [
			{ name: 'Aviso Legal', href: '#' },
			{ name: 'Política de privacidad', href: '#' },
			{ name: 'Política de cookies', href: '#' },
			{ name: 'Términos y condiciones', href: '#' },
		],
	},
]


describe('Footer component', () => {
	afterEach(() => {
		cleanup()
	})
	test('renders footer links correctly', () => {
		render(<Footer />)

		footerLinks.forEach((footerLink) => {
			const categoryElement = screen.getByText(footerLink.category)
			expect(categoryElement).toBeDefined()

			const categoryContainer = categoryElement.closest('div')

			footerLink.links.forEach((link) => {

				const linkElement = within(categoryContainer!).getByText(link.name, { selector: 'a' })
				expect(linkElement).toBeDefined()

				const anchorElement = linkElement.closest('a')

				expect(anchorElement).toBeDefined()

				if (anchorElement) {
					expect(anchorElement.getAttribute('href')).toBe(link.href)
				}
			})
		})
	})
})