import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import api from '../../../../api/api'
import { userService } from '../../../../services/user/userService'
import {
	UserModel,
	AirtableUser,
	ResponseModel,
	AirtableUserResponse,
} from '../../../../types/airtableUser'

vi.mock('../../../../api/api')

const mockUser: UserModel = {
	uid: '1',
	name: 'John Doe',
	email: 'john@example.com',
	role: 'anonimo',
}
const mockAirtableUser: AirtableUser = {
	id: '1',
	'Nombre Cliente/Empresa': 'John Doe',
	'correo electronico': 'john@example.com',
	Rol: 'anonimo',
}
const mockResponse: ResponseModel<UserModel> = {
	data: [mockUser],
	message: 'Success',
}
const mockAirtableResponse: ResponseModel<AirtableUser> = {
	data: [mockAirtableUser],
	message: 'Success',
}
const mockAirtableUserResponse: ResponseModel<AirtableUserResponse[]> = {
	data: [{ ...mockAirtableUser }],
	message: 'Success',
} as unknown as ResponseModel<AirtableUserResponse[]>

describe('userService', () => {
	it('should create a user', async () => {
		;(api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse })

		const result = await userService.createUser(mockUser)
		expect(result).toEqual(mockResponse)
	})

	it('should create an anonymous Airtable user', async () => {
		;(api.post as jest.Mock).mockResolvedValueOnce({
			data: mockAirtableResponse,
		})

		const result =
			await userService.createAnonymousAirtableUser(mockAirtableUser)
		expect(result).toEqual(mockAirtableResponse)
	})

	it('should update email role', async () => {
		const mockEntity = { id: '1', email: 'john.doe@example.com' }
		;(api.post as jest.Mock).mockResolvedValueOnce({
			data: mockAirtableResponse,
		})

		const result = await userService.updateEmailRole(mockEntity)
		expect(result).toEqual(mockAirtableResponse)
	})

	it('should update a user', async () => {
		const mockEntity = { id: '1', email: 'john.doe@example.com' }
		;(api.patch as jest.Mock).mockResolvedValueOnce({ data: mockResponse })

		const result = await userService.updateUser(mockEntity)
		expect(result).toEqual(mockResponse)
	})

	it('should delete a user', async () => {
		;(api.delete as jest.Mock).mockResolvedValueOnce({})

		await expect(userService.deleteUser('1')).resolves.toBeUndefined()
	})

	it('should get a user by ID', async () => {
		;(api.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse })

		const result = await userService.getUserById('1')
		expect(result).toEqual(mockResponse)
	})

	it('should get a user by UID', async () => {
		;(api.get as jest.Mock).mockResolvedValueOnce({
			data: mockAirtableUserResponse,
		})

		const result = await userService.getUserByUid('uid123')
		expect(result).toEqual(mockAirtableUserResponse)
	})

	// Puedes agregar pruebas para manejar errores de la API
})
