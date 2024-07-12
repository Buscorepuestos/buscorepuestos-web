import api from '../../api/api'
import { ApiResponse } from '../../types/response'
import { BillingModel } from '../../types/billing'

export const createBill = async (data: BillingModel): Promise<ApiResponse> => {
	try {
		return (await api.post(`/billings`, { data })).data;
	} catch (error) {
		console.error('Error creating bill:', error)
		throw error
	}
}
