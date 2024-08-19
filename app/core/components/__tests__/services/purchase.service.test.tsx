import { describe, it, expect, vi } from 'vitest'
import api from '../../../../api/api'
import {
	savePurchase,
	deletePurchase,
	updatePurchase,
} from '../../../../services/purchase/purchase' // Ajusta la ruta según tu estructura
import { ProductMongoInterface } from '@/app/redux/interfaces/product.interface'

// Mock de la API
vi.mock('axios', () => {
	return {
		default: {
			create: vi.fn(() => ({
				post: vi.fn(),
				delete: vi.fn(),
				patch: vi.fn(),
			})),
		},
	}
})

describe('Purchase Service', () => {
	const mockProduct: ProductMongoInterface = {
		_id: 'product123',
		// otras propiedades necesarias
	}

	const mockUserId = 'user123'
	const mockPurchaseId = 'purchase123'

	describe('savePurchase', () => {
		it('should save a purchase and return the purchaseId', async () => {
			const mockResponse = {
				data: {
					data: {
						fields: {
							id: mockPurchaseId,
						},
					},
				},
			}

			;(api.post as vi.Mock).mockResolvedValue(mockResponse)

			const result = await savePurchase(mockProduct, mockUserId)
			expect(result).toEqual({ purchaseId: mockPurchaseId })
		})

		it('should handle errors when saving a purchase', async () => {
			;(api.post as vi.Mock).mockRejectedValue(new Error('API Error'))

			await expect(savePurchase(mockProduct, mockUserId)).rejects.toThrow(
				'API Error'
			)
		})
	})

	describe('deletePurchase', () => {
		it('should delete a purchase', async () => {
			;(api.delete as vi.Mock).mockResolvedValue({})

			await expect(
				deletePurchase(mockPurchaseId)
			).resolves.toBeUndefined()
		})

		it('should handle errors when deleting a purchase', async () => {
			;(api.delete as vi.Mock).mockRejectedValue(new Error('API Error'))

			await expect(deletePurchase(mockPurchaseId)).rejects.toThrow(
				'API Error'
			)
		})
	})

	describe('updatePurchase', () => {
		it('should update a purchase', async () => {
			;(api.patch as vi.Mock).mockResolvedValue({})

			await expect(
				updatePurchase(mockPurchaseId)
			).resolves.toBeUndefined()
		})

		it('should handle errors when updating a purchase', async () => {
			;(api.patch as vi.Mock).mockRejectedValue(new Error('API Error'))

			await expect(updatePurchase(mockPurchaseId)).rejects.toThrow(
				'API Error'
			)
		})
	})
})
