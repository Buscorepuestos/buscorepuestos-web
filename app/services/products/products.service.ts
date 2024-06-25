import api from '../../api/api'

export const getProducts = async (size: number = 16, sort: string = 'created', order: string = 'desc'): Promise<T> => {
	try {
		const response = await api.get<any[]>(`/products/store?size=${size}&sort=${sort}&order=${order}`)
		return response.data.data.selectedProducts
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}
