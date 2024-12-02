import api from '../../api/api'
import { ApiResponse } from '../../types/response'

export const subscribe = async (email: string): Promise<ApiResponse> => {
    try {
        return (await api.post(`/mailchimp/subscribe`, { email })).data;
    } catch (error) {
        console.error('Error subscribing:', error)
        throw error
    }
}

export const updateUser = async (user: any): Promise<ApiResponse> => {
    try {
        return (await api.patch(`/mailchimp/update`, { user })).data;
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}
