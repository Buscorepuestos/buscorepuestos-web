import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductMongoInterface } from '../interfaces/product.interface'

export interface CartItem {
	productName: string
	title: string
	mainReference: string
	buscorepuestosPrice: number
	brand: string
	articleModel: string
	images: string[]
	_id: string | undefined
	quantity: number
	stock: boolean
}

export interface CartState {
	items: CartItem[]
}

export const loadStateFromLocalStorage = (): CartItem[] => {
	try {
		const serializedState = localStorage.getItem('cart')
		if (serializedState === null) {
			return []
		}
		return JSON.parse(serializedState)
	} catch (err) {
		return []
	}
}

export const getInitialState = (): CartState => ({
	items: typeof window !== 'undefined' ? loadStateFromLocalStorage() : [],
})

const initialState = getInitialState()

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (
			state,
			action: PayloadAction<ProductMongoInterface>
		) => {
			const existingItem = state.items.find(
				(item) => item._id === action.payload._id
			)
			if (existingItem) {
				existingItem.quantity += 1
			} else {
				const newItem = {
					...selectProductProperties(action.payload),
					quantity: 1,
				}
				state.items.push(newItem)
			}
		},
		removeItemFromCart: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(
				(item) => item._id !== action.payload
			)
		},
		clearCart: (state) => {
			state.items = []
		},
	},
})

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

export const selectProductProperties = (product: ProductMongoInterface) => ({
	productName: product.productName,
	title: product.title,
	mainReference: product.mainReference,
	buscorepuestosPrice: product.buscorepuestosPrice,
	brand: product.brand,
	articleModel: product.articleModel,
	images: product.images,
	_id: product._id,
	stock: product.stock,
})
