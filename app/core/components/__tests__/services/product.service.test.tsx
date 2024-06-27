import { describe, it, expect, vi, beforeEach, test } from 'vitest'
import api from '../../../../api/api'
import { IProductMongoose } from '../../../../types/product'
import { getProducts } from '../../../../services/products/products.service'

// Mockea el módulo api
vi.mock('../../../../api/api', () => ({
	default: {
		get: vi.fn(),
	},
}))

describe('getProducts', () => {
	beforeEach(() => {
		// Resetea todos los mocks antes de cada prueba
		vi.resetAllMocks()
	})

	test('should return products when API call is successful', async () => {
		// Mock data
		const mockProducts: IProductMongoose[] = [
			{
				_id: '6658b18fa46eaf40cfedb202',
				articleModel: 'RAV 4 (A3)',
				brand: 'TOYOTA',
				buscorepuestosPrice: 53.95,
				engine: 'Executive',
				engineCode: '1AZ',
				images: [
					'https://cdn11.metasync.com/XFxeeaJE61mS0IGGOf3cvog8gWFttIDA9wGHl2N7DyKwNbXhxixbzg==',
					'https://cdn11.metasync.com/n0WsB6SHRxkDbmZogcbp1eczyI4UJSD6lpEha91chPc0fc0e1Ya-pA==',
					'https://cdn11.metasync.com/ZTQjgMFN5-cyJkD8a0_5KyAMwEF3YLnOuCqLsIqW6kjWq050zy1Xeg=='
				],
				isNewProduct: false,
				mainReference: '17X7J45M7',
				price: 53.95,
				shipmentPrice: 22,
				stock: true,
				title: 'LLANTA TOYOTA RAV 4 (A3) 17X7J45M7',
				year: 2008,
				buscorepuestosReference: new Date(),
				createdAt: new Date(),
				distributorReference: '-',
				doors: 4,
				frame: '-',
				url: '-',
				version: '-',
				gearbox: '-',
				references: [],
				observations: '-',
			} as IProductMongoose,
		];

		// Mock the API response
		(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: {
				data: {
					selectedProducts: mockProducts,
				},
			},
		})

		const products = await getProducts()
		expect(products.data.data.selectedProducts).toEqual(mockProducts)
	})

	test('should throw an error when API call fails', async () => {
		// Mock the API response to throw an error
		(api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API error'))

		await expect(getProducts()).rejects.toThrow('API error')
	})
})
