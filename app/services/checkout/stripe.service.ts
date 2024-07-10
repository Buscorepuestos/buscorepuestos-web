import api from '../../api/api'
import { ApiResponse } from '../../types/response'
import { PaymentIntentRequest } from '../../types/stripe/payment-intent'

export const createPaymentIntent = async (data: PaymentIntentRequest): Promise<ApiResponse> => {
	try {
		return (await api.post(`/stripe/payment-intent`, data)).data;
	} catch (error) {
		console.error('Error creating Payment Intent:', error)
		throw error
	}
}
