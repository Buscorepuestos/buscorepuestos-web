import api from '../../api/api'

export interface AdminProductPrice {
	_id: string
	title: string
	productName?: string
	buscorepuestosReference?: string
	distributorReference?: string
	buscorepuestosPrice: number
	images?: string[]
	updatedAt?: string
}

interface ApiEnvelope<T> {
	data: T
}

const authorization = (idToken: string) => ({
	headers: { Authorization: `Bearer ${idToken}` },
})

export const verifyAdminSession = async (idToken: string): Promise<void> => {
	await api.get('/admin/session', authorization(idToken))
}

export const getAdminProduct = async (
	productId: string,
	idToken: string
): Promise<AdminProductPrice> => {
	const response = await api.get<ApiEnvelope<AdminProductPrice>>(
		`/admin/products/${encodeURIComponent(productId)}`,
		authorization(idToken)
	)
	return response.data.data
}

export const updateAdminProductPrice = async (
	productId: string,
	buscorepuestosPrice: number,
	idToken: string
): Promise<AdminProductPrice> => {
	const response = await api.patch<ApiEnvelope<AdminProductPrice>>(
		`/admin/products/${encodeURIComponent(productId)}/price`,
		{ buscorepuestosPrice },
		authorization(idToken)
	)
	return response.data.data
}
