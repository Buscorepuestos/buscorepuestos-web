import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import shoppingCartReducer, {
	addItemToCart,
	removeItemFromCart,
	clearCart,
	CartItem,
	CartState,
	selectProductProperties,
	loadStateFromLocalStorage,
} from '../../../../redux/features/shoppingCartSlice'
import { ProductMongoInterface } from '../../../../redux/interfaces/product.interface'
import { getInitialState } from '../../../../redux/features/shoppingCartSlice';

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

// Mock de localStorage
const localStorageMock: Storage = (function () {
	let store: { [key: string]: string } = {}
	return {
		getItem(key: string) {
			return store[key] || null
		},
		setItem(key: string, value: string) {
			store[key] = value
		},
		clear() {
			store = {}
		},
		length: 0,
		key(index: number) {
			return null
		},
		removeItem(key: string) {
			delete store[key]
		},
	}
})()

describe('shoppingCartSlice', () => {
	let initialState: CartState

	beforeEach(() => {
		initialState = {
			items: [],
		}
	})

	it('should return the initial state', () => {
		expect(shoppingCartReducer(undefined, { type: 'SOME_TYPE' })).toEqual(
			initialState
		)
	})

	it('should handle addItemToCart', () => {
		const state = shoppingCartReducer(
			initialState,
			addItemToCart(mockProduct)
		)
		expect(state.items.length).toBe(1)

		const addedItem: CartItem = state.items[0]
		expect(addedItem).toMatchObject({
			productName: 'Test Product',
			title: 'Test Title',
			mainReference: '12345',
			buscorepuestosPrice: 100,
			brand: 'Test Brand',
			articleModel: 'Model 1',
			images: ['image1.jpg'],
			_id: '1',
			quantity: 1,
		})

		// Test adding the same product again
		const stateAfterAddingSameProduct = shoppingCartReducer(
			state,
			addItemToCart(mockProduct)
		)
		expect(stateAfterAddingSameProduct.items.length).toBe(1)
		expect(stateAfterAddingSameProduct.items[0].quantity).toBe(2)
	})

	it('should handle removeItemFromCart', () => {
		const stateWithItem: CartState = {
			items: [{ ...selectProductProperties(mockProduct), quantity: 1 }],
		}
		const state = shoppingCartReducer(
			stateWithItem,
			removeItemFromCart(mockProduct._id!)
		)
		expect(state.items.length).toBe(0)
	})

	it('should handle clearCart', () => {
		const stateWithItems: CartState = {
			items: [
				{ ...selectProductProperties(mockProduct), quantity: 1 },
				{
					...selectProductProperties(mockProduct),
					_id: '2',
					quantity: 2,
				},
			],
		}
		const state = shoppingCartReducer(stateWithItems, clearCart())
		expect(state.items.length).toBe(0)
	})
})

describe('loadStateFromLocalStorage', () => {
	beforeEach(() => {
		global.localStorage = localStorageMock
	})

	afterEach(() => {
		localStorage.clear()
	})

	it('should return an empty array if there is no cart in localStorage', () => {
		expect(loadStateFromLocalStorage()).toEqual([])
	})

	it('should return an empty array if there is invalid JSON in localStorage', () => {
		localStorage.setItem('cart', '{invalidJson')
		expect(loadStateFromLocalStorage()).toEqual([])
	})

	it('should return cart items from localStorage', () => {
		const cartItems: CartItem[] = [
			{
				productName: 'Test Product',
				title: 'Test Title',
				mainReference: '12345',
				buscorepuestosPrice: 100,
				brand: 'Test Brand',
				articleModel: 'Model 1',
				images: ['image1.jpg'],
				_id: '1',
				quantity: 1,
			},
		]
		localStorage.setItem('cart', JSON.stringify(cartItems))
		expect(loadStateFromLocalStorage()).toEqual(cartItems)
	})
})

describe('getInitialState', () => {
	beforeEach(() => {
		global.localStorage = localStorageMock
	})

	afterEach(() => {
		localStorage.clear()
	})

	it('should initialize state from localStorage', () => {
		const initialCartItems = [{
			productName: 'Test Product',
			title: 'Test Title',
			mainReference: '12345',
			buscorepuestosPrice: 100,
			brand: 'Test Brand',
			articleModel: 'Model 1',
			images: ['image1.jpg'],
			_id: '1',
			quantity: 1,
		}]
		localStorage.setItem('cart', JSON.stringify(initialCartItems))

		const expectedState: CartState = getInitialState()

		expect(expectedState).toEqual({ items: initialCartItems })
	})

	it('should initialize state as empty array if localStorage is empty', () => {
		localStorage.setItem('cart', JSON.stringify([]))

		const expectedState: CartState = getInitialState()

		expect(expectedState).toEqual({ items: [] })
	})

	it('should initialize state as empty array if localStorage has invalid JSON', () => {
		localStorage.setItem('cart', '{invalidJson')

		const expectedState: CartState = getInitialState()

		expect(expectedState).toEqual({ items: [] })
	})

    it('should handle case when window is undefined (server-side rendering)', () => {
		const originalWindow = global.window
		global.window = undefined as any

		const expectedState: CartState = {
			items: [],
		}
		expect(getInitialState()).toEqual(expectedState)

		global.window = originalWindow
	})
})