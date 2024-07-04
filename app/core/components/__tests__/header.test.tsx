import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../global/header'

// Simulación de usePathname usando vi.fn()
const usePathnameMock = vi.fn()

vi.mock('next/navigation', () => ({
	usePathname: () => usePathnameMock(),
}))

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
	window.innerWidth = width
	window.innerHeight = height
	window.dispatchEvent(new Event('resize'))
}

describe('Componente Header', () => {
	afterEach(() => {
		cleanup()
		vi.clearAllMocks() // Limpia los mocks después de cada prueba
	})

	beforeEach(() => {
		usePathnameMock.mockReturnValue('/') // Valor por defecto de usePathname
	})

	test('Elementos del slider', () => {
		render(<Header />)
		// Verificar si se renderiza el logo img
		expect(screen.getByAltText('Header')).toBeDefined()
	})

	test('Todos los enlaces del menú', () => {
		render(<Header />)
		const todosLosEnlaces = [...principalMenuLinks, ...secondaryMenuLinks]

		todosLosEnlaces.forEach((enlace) => {
			expect(screen.getByText(enlace.label)).toBeDefined()
		})
	})

	test('Alternar abrir y cerrar menú', () => {
		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = render(<Header />)
		const botonMenu = getByAltText('Hamburguesa')

		fireEvent.click(botonMenu)

		expect(getByTestId('Menu')).toBeTruthy()
	})

	test('Alternar abrir y cerrar menú secundario', () => {
		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = render(<Header />)
		const botonMenu = getByAltText('Hamburguesa')

		fireEvent.click(botonMenu)

		const botonMenuSecundario = getByTestId('secondary-toggle')

		fireEvent.click(botonMenuSecundario)

		expect(getByTestId('secondary-menu')).toBeTruthy()
	})

	test('Aplica clase mt-[vw] cuando pathname comienza con /producto', () => {
		usePathnameMock.mockReturnValue('/producto/123');
		render(<Header />);
		const sectionElement = screen.getByRole('region'); // Asegúrate de tener role="region" en la sección si no ya lo tienes
		expect(sectionElement.className).toContain('mt-0');
	});
	
	test('No aplica clase mt-[1vw] cuando pathname no comienza con /producto', () => {
		usePathnameMock.mockReturnValue('/');
		render(<Header />);
		const sectionElement = screen.getByRole('region'); // Asegúrate de tener role="region" en la sección si no ya lo tienes
		expect(sectionElement.className).not.toContain('mt-[1vw]');
	});
})
