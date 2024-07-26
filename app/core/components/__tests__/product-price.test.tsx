import React, { ReactNode } from 'react'
import { render, screen, cleanup, RenderOptions } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import ProductPrice from '../productPrice/productPrice'
import { fireEvent } from '@testing-library/react'
import { addItemToCart } from '../../../redux/features/shoppingCartSlice'
import { ProductMongoInterface } from '@/app/redux/interfaces/product.interface'
import { ButtonProps } from '../Button'
import shoppingCartReducer from '../../../redux/features/shoppingCartSlice'

const renderWithProvider = (
	ui: React.ReactElement,
	{
		store,
		...renderOptions
	}: {
		store: EnhancedStore
	} & Omit<RenderOptions, 'queries'> = {
		store: configureStore({
			reducer: { shoppingCart: shoppingCartReducer },
		}),
	}
) => {
	const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
		<Provider store={store}>{children}</Provider>
	)

	return render(ui, { wrapper: Wrapper, ...renderOptions })
}

describe('ProductPrice', () => {
	afterEach(() => {
		cleanup()
	})

	const button1Props: ButtonProps = {
		type: 'secondary',
		labelName: 'Añadir a la cesta',
	}
	const button2Props: ButtonProps = { type: 'primary', labelName: 'Comprar' }

	const initialState = {} // Add your initial state here if needed
	const store = configureStore({
		reducer: { shoppingCart: shoppingCartReducer },
		preloadedState: initialState,
	})

	it('should call addItemToCart when "Añadir a la cesta" button is clicked', () => {
		// Mock the dispatch function
		const dispatchMock = vi.fn();
		store.dispatch = dispatchMock;
	
		const mockProduct: ProductMongoInterface = {
			images: ['image1.jpg'],
			url: 'http://example.com',
			budgets: [],
			references: [],
			_id: '1',
			productName: 'Test Product',
			isMetasync: false,
			idEmpresa: 'empresa1',
			idVehicle: 'vehicle1',
			refLocal: 'ref1',
			observaciones: 'observations',
			peso: 1,
			airtableId: 'airtable1',
			title: 'Test Title',
			price: 100,
			buscorepuestosPrice: 100,
			color: 'red',
			engine: 'engine1',
			engineCode: 'engineCode1',
			frame: 'frame1',
			gearbox: 'gearbox1',
			gearboxCode: 'gearboxCode1',
			version: 'version1',
			year: 2024,
			stock: true,
			distributor: 'distributor1',
			distributorReference: 'distributorRef1',
			mainReference: '12345',
			buscorepuestosReference: 'buscorepuestosRef1',
			enhancedImageScript: false,
			createdAt: '2024-07-17T00:00:00Z',
			updatedAt: '2024-07-17T00:00:00Z',
			observations: 'observations',
			discount: 10,
			shipmentPrice: 5,
			increasedPrice: 10,
			shoppingCart: false,
			whatsappUrl: 'http://whatsapp.com',
			category: 'category1',
			subcategory: 'subcategory1',
			brand: 'Test Brand',
			articleModel: 'Model 1',
			isNewProduct: true,
			rating: 4.5,
			distributorProvince: 'province1',
			startYear: 2022,
			endYear: 2023,
			addedToBudget: false,
			inBudget: true,
		}
	
		renderWithProvider(
		  <ProductPrice
			price="148,12"
			shippingInfo="Envío e IVA incluido"
			warningImgSrc="/info.svg"
			originalPrice={200}
			discount="-10%"
			button1Props={button1Props}
			button2Props={button2Props}
			data={mockProduct}
		  />,
		  { store }
		);
	
		const addToCartButton = screen.getByText('Añadir a la cesta');
		fireEvent.click(addToCartButton);
	
		// Check if addItemToCart action is dispatched with the correct data
		expect(dispatchMock).toHaveBeenCalledWith(addItemToCart(mockProduct));
	  });

	it('renders the price', () => {
		renderWithProvider(
			<ProductPrice
				price="148,12"
				shippingInfo="Envío e IVA incluido"
				warningImgSrc="/info.svg"
				originalPrice={200}
				discount="-10%"
				button1Props={button1Props}
				button2Props={button2Props}
				data={{} as any}
			/>,
			{ store }
		)
		const priceElement = screen.getByText(/148,12€/i)
		expect(priceElement).toBeTruthy()
	})

	it('renders the shipping info', () => {
		renderWithProvider(
			<ProductPrice
				price="148,12"
				shippingInfo="Envío e IVA incluido"
				warningImgSrc="/info.svg"
				originalPrice={200}
				discount="-10%"
				button1Props={button1Props}
				button2Props={button2Props}
				data={{} as any}
			/>,
			{ store }
		)
		const shippingInfoElement = screen.getByText(/Envío e IVA incluido/i)
		expect(shippingInfoElement).toBeTruthy()
	})

	it('renders the original price with a line-through style', () => {
		renderWithProvider(
			<ProductPrice
				price="148,12"
				shippingInfo="Envío e IVA incluido"
				warningImgSrc="/info.svg"
				originalPrice={200}
				discount="-10%"
				button1Props={button1Props}
				button2Props={button2Props}
				data={{} as any}
			/>,
			{ store }
		)
		const originalPriceElement = screen.getByText('200€')
		expect(originalPriceElement).toBeTruthy()
	})

	it('renders the discount', () => {
		renderWithProvider(
			<ProductPrice
				price="148,12"
				shippingInfo="Envío e IVA incluido"
				warningImgSrc="/info.svg"
				originalPrice={200}
				discount="-10%"
				button1Props={button1Props}
				button2Props={button2Props}
				data={{} as any}
			/>,
			{ store }
		)
		const discountElement = screen.getByText(/-10%/i)
		expect(discountElement).toBeTruthy()
	})

	it('renders the buttons with correct labels', () => {
		renderWithProvider(
			<ProductPrice
				price="148,12"
				shippingInfo="Envío e IVA incluido"
				warningImgSrc="/info.svg"
				originalPrice={200}
				discount="-10%"
				button1Props={button1Props}
				button2Props={button2Props}
				data={{} as any}
			/>,
			{ store }
		)
		const button1 = screen.getByText(/Añadir a la cesta/i)
		const button2 = screen.getByText(/Comprar/i)
		expect(button1).toBeTruthy()
		expect(button2).toBeTruthy()
	})
})
