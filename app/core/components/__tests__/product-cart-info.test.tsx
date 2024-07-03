import { act, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeAll, vi, test } from 'vitest'
import ProductCartInfo from '../shopping-cart/ProductCartInfo'

describe('ProductCartInfo', () => {
	const defaultProps = {
		image: '/card-preview.webp',
		title: 'Sample Product',
		brand: 'Sample Brand',
		model: 'Model XYZ',
		ref: 'REF123',
		price: 99.99,
		isMobile: false,
	}

	const renderComponent = (props = defaultProps) => {
		render(<ProductCartInfo {...props} />)
	}

	beforeAll(() => {
		// Mock matchMedia for the isMobile check
		window.matchMedia = vi.fn().mockImplementation(query => {
			return {
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(), // deprecated
				removeListener: vi.fn(), // deprecated
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}
		})
	})

	test('renders the product information correctly', () => {
		renderComponent(defaultProps)

		expect(screen.getByText(/sample product/i)).toBeDefined()
		expect(screen.getByText(/sample brand model xyz/i)).toBeDefined()
		expect(screen.getByText(/ref\. ref123/i)).toBeDefined()
		expect(screen.getByText(/99,99€/i)).toBeDefined()
	})

	test('renders the image with correct attributes', () => {
		const image = screen.getByAltText(/Sample Product/i)
		expect(image).toBeDefined()
		expect(image.src).toBeDefined()
		expect(image.src, expect.stringContaining('/card-preview.webp'))
		expect(image.width).toBeDefined()
		expect(image.width).toBe(96)
		expect(image.height).toBeDefined()
		expect(image.height).toBe(72)
	})

	test('renders Trash component', () => {
		const trashIcon = screen.getByTestId('trash-icon')
		expect(trashIcon).toBeDefined()
	})

	test('renders the image with correct width by device resolution', () => {
		renderComponent({...defaultProps, isMobile: true, title: 'Paragolpes Delantero'});

		const image = screen.getByAltText(/Paragolpes Delantero/i)
		expect(image).toBeDefined()
		expect(image.src).toBeDefined()
		expect(image.src, expect.stringContaining('/card-preview.webp'))
		expect(image.width).toBeDefined()
		expect(image.width).toBe(84)
		expect(image.height).toBeDefined()
		expect(image.height).toBe(72)
	})

})
