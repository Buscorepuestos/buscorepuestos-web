import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { localStorageMiddleware } from '../../../../redux/middlewares/localStorageMiddleware'
import { cartSlice } from '../../../../redux/features/shoppingCartSlice'
import { configureStore } from '@reduxjs/toolkit'

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

describe('localStorageMiddleware', () => {
	let store: ReturnType<typeof configureStore>

	beforeEach(() => {
		global.localStorage = localStorageMock

		store = createStore(
			combineReducers({ cart: cartSlice.reducer }), 
			applyMiddleware(localStorageMiddleware)
		)
	})

	afterEach(() => {
		localStorage.clear()
	})

	it('should store cart items in localStorage when addItemToCart action is dispatched', () => {
		const addItemAction = {
			type: 'cart/addItemToCart',
			payload: {
				productName: 'Test Product',
				title: 'Test Title',
				mainReference: '12345',
				buscorepuestosPrice: 100,
				brand: 'Test Brand',
				articleModel: 'Model 1',
				images: ['image1.jpg'],
				_id: '1',
				quantity: 1,
				airtableId: 'airtableId1',
				refLocal: 'refLocal1',
				idEmpresa: 'idEmpresa1',
				isMetasync: true,
			},
		}

		store.dispatch(addItemAction)

		const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')

		const expectedCartItems = [
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
				airtableId: 'airtableId1',
				refLocal: 'refLocal1',
				saveStatus: 'saving',
				idEmpresa: 'idEmpresa1',
				isMetasync: true,
				origin: ""
			},
		]

		expect(cartItems).toEqual(expectedCartItems)
	})

	it('should store cart items in localStorage when removeItemFromCart action is dispatched', () => {

		store.dispatch({
			type: 'cart/addItemToCart',
			payload: {
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
		})


		store.dispatch({
			type: 'cart/removeItemFromCart',
			payload: '1',
		})


		const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')

		const expectedCartItems: any[] = []

		expect(cartItems).toEqual(expectedCartItems)
	})

	it('should store empty array in localStorage when clearCart action is dispatched', () => {

		store.dispatch({
			type: 'cart/addItemToCart',
			payload: {
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
		})

		store.dispatch({
			type: 'cart/clearCart',
		})

		const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')

		const expectedCartItems: any[] = []

		expect(cartItems).toEqual(expectedCartItems)
	})

	it('should not store in localStorage for unrelated actions', () => {
		const unrelatedAction = {
			type: 'some/otherAction',
		}

		store.dispatch(unrelatedAction)
        
		expect(localStorage.getItem('cart')).toBeNull()
	})
})
