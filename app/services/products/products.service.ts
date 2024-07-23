import { T } from 'vitest/dist/reporters-yx5ZTtEV.js'
import api from '../../api/api'
import { AxiosResponse } from 'axios'

export const getProducts = async (size: number = 16, sort: string = 'created', order: string = 'desc'): Promise<AxiosResponse<T>> => {
	try {
		return await api.get(`/products/store?size=${size}&sort=${sort}&order=${order}`)
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export const getProductById = async (id: string): Promise<AxiosResponse<T>> => {
	try {
		return await api.get(`/products/product-mongo/${id}`)
	} catch (error) {
		console.error('Error fetching product:', error)
		throw error
	}
}
