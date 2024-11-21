// src/services/userService.ts
import api from '../../api/api';
import { AirtableUser, UserModel, ResponseModel, AirtableUserResponse, AirtableUserState } from '../../types/airtableUser';

export const userService = {
    async createUser(user: UserModel): Promise<ResponseModel<UserModel>> {
        const res = await api.post<ResponseModel<UserModel>>(`/auth/create`, {
            data: user,
        });
        return res.data;
    },

    async createAnonymousAirtableUser(user: AirtableUser): Promise<ResponseModel<AirtableUserResponse>> {
        const res = await api.post<ResponseModel<AirtableUserResponse>>(`/users/create`, {
            data: user,
        });
        return res.data;
    },

    async updateEmailRole(entity: any): Promise<ResponseModel<AirtableUser>> {
        const res = await api.post<ResponseModel<AirtableUser>>(`/auth/upgradeAnonymous`, {
            data: entity,
        });
        return res.data;
    },

    async updateUser(entity: any): Promise<ResponseModel<UserModel>> {
        const res = await api.patch<ResponseModel<UserModel>>(`/users/${entity.id}`, {
            data: entity,
        });
        return res.data;
    },

    async deleteUser(id: string): Promise<void> {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    },

    async getUserById(userId: string): Promise<AirtableUserState> {
        const res = await api.get<AirtableUserState>(`/users/${userId}`);
        return res.data;
    },

    async getUserByUid(uid: string): Promise<ResponseModel<AirtableUserResponse>> {
        const res = await api.get<ResponseModel<AirtableUserResponse>>(`/users/?uid_like=${uid}`);
        return res.data;
    },

    async createUserAddresses(entity: any): Promise<ResponseModel<any>> {
        const res = await api.post<ResponseModel<any>>(`/user-addresses`, {
            data: entity,
        });
        return res.data;
    },
    
    async getUserAdressesById(addressId: string): Promise<any> {
        const res = await api.get<any>(`/user-addresses/${addressId}`);
        return res.data;
    },
};
