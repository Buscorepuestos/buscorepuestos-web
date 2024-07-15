// src/services/__tests__/billingService.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ApiResponse } from '../../../../types/response'
import { BillingModel } from '../../../../types/billing'
import api from '../../../../api/api'
import { createBill } from '../../../../services/billing/billing.service'

vi.mock('../../../../api/api', () => ({
	default: {
		post: vi.fn(),
	},
}))

describe('createBill', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should create a bill and return the response', async () => {
		const mockResponse = {
			data: { fields:{
					'Id Pago Stripe': 'pi_12313131313213',
					Compras: ['recV9AQVCb64NveMF'],
					Usuarios:['recxNb1bKbkcrueq1'],
					transfer: false,
					address:'Direccion de prueba',
					country:'España',
					location:'Las Palmas de Gran Canarias',
					addressNumber:'14',
					name:'Carlos',
					cp:'3012',
					nif:'3456fg',
					phone: 66666666,
					province:'Las Palmas'
		} },
			message: 'Bill created successfully'
		} as ApiResponse;

		const mockData: BillingModel = {
			'Id Pago Stripe': 'pi_12313131313213',
			Compras: ['recV9AQVCb64NveMF'],
			Usuarios:['recxNb1bKbkcrueq1'],
			transfer: false,
			address:'Direccion de prueba',
			country:'España',
			location:'Las Palmas de Gran Canarias',
			addressNumber:'14',
			name:'Carlos',
			cp:'3012',
			nif:'3456fg',
			phone: 66666666,
			province:'Las Palmas'
		};

		// Mock the API response
		(api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

		// Call the createBill service
		const result = await createBill(mockData);

		// Assertions
		expect(result).toEqual(mockResponse.data);
		expect(api.post).toHaveBeenCalledWith('/billings', { data: mockData });
	});

	test('should throw an error if the API call fails', async () => {
		const mockError = new Error('API Error: error creating resource');

		const mockData: BillingModel = {
			name: 'John Doe',
			nif: '123456789',
			address: '123 Main St',
			addressNumber: '456',
			location: 'City',
			province: 'Province',
			cp: '12345',
			country: 'Country',
			phone: 1234567890,
			transfer: true,
			"Usuarios": [],
			"Compras": [],
		};

		// Mock the API response to throw an error
		(api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

		// Call the createBill service and expect an error to be thrown
		await expect(createBill(mockData)).rejects.toThrow('API Error: error creating resource');
		expect(api.post).toHaveBeenCalledWith('/billings', { data: mockData });
	});
});
