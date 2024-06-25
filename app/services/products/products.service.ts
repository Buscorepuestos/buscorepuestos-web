import api from '../../api/api'
import { AxiosResponse } from 'axios'

export const getProducts = async (size: number = 116, sort: string = 'created', order: string = 'desc'): Promise<AxiosResponse<T>> => {
	try {
		return await api.get(`/products/store?size=${size}&sort=${sort}&order=${order}`)
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}
