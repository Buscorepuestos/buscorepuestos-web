import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, RenderOptions } from '@testing-library/react'
import { Header } from '../global/header'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import shoppingCartReducer from '../../../redux/features/shoppingCartSlice'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

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

const renderWithProvider = (
	ui: React.ReactElement,
	{
		store,
		...renderOptions
	}: {
		store: EnhancedStore
	} & Omit<RenderOptions, 'queries'> = {
		store: configureStore({
			reducer: { cart: shoppingCartReducer },
			preloadedState: { cart: { items: [] } }, // Ajusta el estado inicial aquí
		}),
	}
) => {
	const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
		<Provider store={store}>{children}</Provider>
	)

	return render(ui, { wrapper: Wrapper, ...renderOptions })
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
		renderWithProvider(<Header />)
		// Verificar si se renderiza el logo img
		expect(screen.getByAltText('Header')).toBeDefined()
	})

	test('Todos los enlaces del menú', () => {
		renderWithProvider(<Header />)
		const todosLosEnlaces = [...principalMenuLinks, ...secondaryMenuLinks]

		todosLosEnlaces.forEach((enlace) => {
			expect(screen.getByText(enlace.label)).toBeDefined()
		})
	})

	test('Alternar abrir y cerrar menú', () => {
		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = renderWithProvider(<Header />)
		const botonMenu = getByAltText('Hamburguesa')

		fireEvent.click(botonMenu)

		expect(getByTestId('Menu')).toBeTruthy()
	})

	test('Alternar abrir y cerrar menú secundario', () => {
		resizeWindow(640, 858)

		const { getByAltText, getByTestId } = renderWithProvider(<Header />)
		const botonMenu = getByAltText('Hamburguesa')

		fireEvent.click(botonMenu)

		const botonMenuSecundario = getByTestId('secondary-toggle')

		fireEvent.click(botonMenuSecundario)

		expect(getByTestId('secondary-menu')).toBeTruthy()
	})

	test('Aplica clase mt-0 cuando pathname comienza con /product y no es pantalla ancha', () => {
		usePathnameMock.mockReturnValue('/producto/123');
		resizeWindow(640, 858); // Simula una pantalla no ancha
		renderWithProvider(<Header />);
		const sectionElement = screen.getByRole('region'); // Asegúrate de tener role="region" en la sección si no ya lo tienes
		expect(sectionElement.className).toContain('mt-0');
	});

	test('Aplica clase mt-[1vw] cuando pathname comienza con /product y es pantalla ancha', () => {
		usePathnameMock.mockReturnValue('/producto/123');
		resizeWindow(1280, 1024); // Simula una pantalla ancha
		renderWithProvider(<Header />);
		const sectionElement = screen.getByRole('region'); // Asegúrate de tener role="region" en la sección si no ya lo tienes
		expect(sectionElement.className).toContain('mt-[1vw]');
	});

	test('Aplica clase absolute cuando pathname no comienza con /product', () => {
		usePathnameMock.mockReturnValue('/');
		renderWithProvider(<Header />);
		const sectionElement = screen.getByRole('region'); // Asegúrate de tener role="region" en la sección si no ya lo tienes
		expect(sectionElement.className).toContain('absolute');
	});
})
