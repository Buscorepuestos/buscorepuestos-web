import { expect, test, describe, afterEach } from 'vitest'
import { cleanup, render, screen, within , fireEvent} from '@testing-library/react'
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

const resizeWindow = (width: number, height: number) => {
	window.innerWidth = width;
	window.innerHeight = height;
	window.dispatchEvent(new Event('resize'));
};

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
	test('toggles menu open and close', () => {

		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = render(<Header />)

		const menuButton = getByAltText('Hamburguesa') 

		fireEvent.click(menuButton)

		expect(getByTestId('Menu')).toBeTruthy()

	})
	test('toggles secondary menu open and close', () => {

		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = render(<Header />)

		const menuButton = getByAltText('Hamburguesa') 

		fireEvent.click(menuButton)

		const menuButtonSecondary = getByTestId('secondary-toggle') 

		fireEvent.click(menuButtonSecondary)

		expect(getByTestId('secondary-menu')).toBeTruthy()

	})

})