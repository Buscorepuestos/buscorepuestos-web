import api from '../../api/api'
import { ApiResponse } from '../../types/response'
import { BillingModel } from '../../types/billing'
// import { PaymentIntentRequest } from '../../types/stripe/payment-intent'

export const createBill = async (data: BillingModel): Promise<ApiResponse> => {
	try {
		return (await api.post(`/billings`, { data })).data;
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}
