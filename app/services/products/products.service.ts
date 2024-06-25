import api from '../../api/api'
import { IProductMongoose } from '../../types/product'

export const getProducts = async (size: number = 116, sort: string = 'created', order: string = 'desc'): Promise<IProductMongoose[]> => {
	try {
		const response = await api.get<any[]>(`/products/store?size=${size}&sort=${sort}&order=${order}`)
		return response.data.data.selectedProducts as IProductMongoose[]
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}
