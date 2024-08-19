// src/services/userService.ts
import api from '../../api/api';
import { AirtableUser, UserModel, ResponseModel, AirtableUserResponse } from '../../types/airtableUser';

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

    async getUserById(userId: string): Promise<UserModel> {
        const res = await api.get<UserModel>(`/users/${userId}`);
        return res.data;
    },

    async getUserByUid(uid: string): Promise<ResponseModel<AirtableUserResponse>> {
        const res = await api.get<ResponseModel<AirtableUserResponse>>(`/users/?uid_like=${uid}`);
        return res.data;
    }
};
