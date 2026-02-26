import api from '../../api/api'
import { AxiosResponse } from 'axios'

export const getProducts = async (size: number = 16, sort: string = 'created', order: string = 'desc'): Promise<AxiosResponse<any>> => {
	try {
		return await api.get(`/products/store?size=${size}&sort=${sort}&order=${order}`)
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export const updateMetasyncProduct = async (id: string, data: any): Promise<AxiosResponse<any>> => {
	try {
		return await api.patch(`/products/metasyncStock/${id}`, data)
	} catch (error) {
		console.error('Error updating metasync product:', error)
		throw error
	}
}

export const getAutocomplete = async (query: string): Promise<string[]> => {
	if (query.trim().length < 2) return [];
	const res = await api.get(`/products/autocomplete?q=${encodeURIComponent(query)}`);
	return res.data?.data ?? [];
};
