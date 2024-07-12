// src/services/__tests__/billingService.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ApiResponse } from '../../../../types/response'
import { BillingModel } from '../../../../types/billing'
import api from '../../../../api/api'
import { createBill } from '../../../../services/billing/billing.service'
import { createPaymentIntent } from '../../../../services/checkout/stripe.service'
import { PaymentIntentRequest } from '../../../../types/stripe/payment-intent'

vi.mock('../../../../api/api', () => ({
	default: {
		post: vi.fn(),
	},
}))

describe('Create Payment Intent', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('should create a stripe payment intent and return the response', async () => {
		const mockResponse = {
			data: {
				id: 'pi_38940560546',
				client_secret: 'sk_gokms983u4892',

			},
			message: 'Payment Intent created successfully',
		}

		const mockData: PaymentIntentRequest = {
			amount: 2000,
			currency: 'eur',
			automatic_payment_methods: { enabled: true },
			cartIDs: []
		};

		// Mock the API response
		(api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

		// Call the createBill service
		const result = await createPaymentIntent(mockData)

		// Assertions
		expect(result).toEqual(mockResponse.data)
		expect(api.post).toHaveBeenCalledWith('/stripe/payment-intent', mockData)
	})

	test('should throw an error if the API call fails', async () => {
		const mockError = new Error('API Error: error creating resource')

		const mockData: PaymentIntentRequest = {
			amount: 2000,
			currency: 'eur',
			automatic_payment_methods: { enabled: true },
			cartIDs: []
		};

		// Mock the API response to throw an error
		(api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(mockError)

		// Call the createBill service and expect an error to be thrown
		await expect(createPaymentIntent(mockData)).rejects.toThrow('API Error: error creating resource')
		expect(api.post).toHaveBeenCalledWith('/stripe/payment-intent', mockData)
	})
})
