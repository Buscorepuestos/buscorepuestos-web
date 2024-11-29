import { render, RenderOptions, screen } from '@testing-library/react'
import { describe, it, expect, beforeAll, vi, test } from 'vitest'
import ProductCartInfo from '../shopping-cart/ProductCartInfo'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import shoppingCartReducer from '../../../redux/features/shoppingCartSlice';

describe('ProductCartInfo', () => {
	const defaultProps = {
		images: ['/card-preview.webp'],
		title: 'Sample Product',
		brand: 'Sample Brand',
		articleModel: 'Model XYZ',
		mainReference: 'REF123',
		buscorepuestosPrice: 99.99,
		isMobile: false,
		stock: true,
		_id: 'productId1',
		productName: 'Sample Product',
	}

	const renderWithProvider = (
		ui: React.ReactElement,
		{
			store,
			...renderOptions
		}: {
			store: ReturnType<typeof configureStore>;
		} & Omit<RenderOptions, 'queries'> = {
			store: configureStore({
				reducer: { cart: shoppingCartReducer },
				preloadedState: { cart: { items: [] } },
			}),
		}
	) => {
		const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
			<Provider store={store}>{children}</Provider>
		);
	
		return render(ui, { wrapper: Wrapper, ...renderOptions });
	};

	const renderComponent = (props = defaultProps) => {
        renderWithProvider(<ProductCartInfo {...props} />);
    };

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
		expect(screen.getByText(/sample brand/i)).toBeDefined()
		expect(screen.getByText(/model xyz/i)).toBeDefined()
		expect(screen.getByText(/ref\. ref123/i)).toBeDefined()
		expect(screen.getByText(/99.99€/i)).toBeDefined()
	})
	
	
	
	test('renders the image with correct attributes', () => {
		const image = screen.getByAltText(/Sample Product/i) as HTMLImageElement
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

		const image = screen.getByAltText(/Paragolpes Delantero/i) as HTMLImageElement
		expect(image).toBeDefined()
		expect(image.src).toBeDefined()
		expect(image.src, expect.stringContaining('/card-preview.webp'))
		expect(image.width).toBeDefined()
		expect(image.width).toBe(84)
		expect(image.height).toBeDefined()
		expect(image.height).toBe(72)
	})

	it('should have default background color and opacity when product is available', () => {
		const { container } = renderWithProvider(<ProductCartInfo {...defaultProps} />);
	
		const articleElement = container.querySelector('article');
		const styles = articleElement ? getComputedStyle(articleElement) : null;
	
		expect(styles?.backgroundColor).toBe('rgba(0, 0, 0, 0)'); 
		expect(styles?.opacity).toBe('1'); 
	});
	
	it('should have different background color and opacity when product is not available', () => {
		const { container } = renderWithProvider(<ProductCartInfo {...defaultProps} stock={false} />);
	
		const articleElement = container.querySelector('article');
		const styles = articleElement ? getComputedStyle(articleElement) : null;
	
		expect(styles?.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
		expect(styles?.opacity).toBe('0.5'); 
	});
})

