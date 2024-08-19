import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
    setCurrentAirtableUser,
    createUser,
    createAnonymousUser,
    updateUser,
    getByuid,
} from '../../../../redux/features/airtableUserSlice';
import { AirtableUser, UserModel } from '../../../../types/airtableUser';
import { userService } from '../../../../services/user/userService';
import airtableUserSlice from '../../../../redux/features/airtableUserSlice';


vi.mock('../../services/user/userService');

interface UserState {
    currentUser: AirtableUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

describe('userSlice', () => {
    let store: ReturnType<typeof configureStore>;

    const initialState: UserState = {
        currentUser: null,
        status: 'idle',
        error: null,
    };

    beforeEach(() => {
        store = configureStore({
            reducer: {
                user: userReducer,
            },
        });
    });

    it('should return the initial state', () => {
        expect(store.getState().user).toEqual(initialState);
    });

    it('should handle setCurrentAirtableUser', () => {
        const mockUser: AirtableUser = { id: '123', fields: {} };
        store.dispatch(setCurrentAirtableUser(mockUser));
        expect(store.getState().user.currentUser).toEqual(mockUser);
    });

    it('should handle createUser.pending', () => {
        store.dispatch(createUser.pending('', {} as UserModel));
        expect(store.getState().user.status).toBe('loading');
    });

    it('should handle createUser.fulfilled', () => {
        const mockUser: AirtableUser = { id: '123', fields: {} };
        store.dispatch(createUser.fulfilled(mockUser, '', {} as UserModel));
        expect(store.getState().user.status).toBe('succeeded');
        expect(store.getState().user.currentUser).toEqual(mockUser);
    });

    it('should handle createUser.rejected', () => {
        const mockError = new Error('Create user failed');
        store.dispatch(createUser.rejected(mockError, '', {} as UserModel));
        expect(store.getState().user.status).toBe('failed');
        expect(store.getState().user.error).toBe('Create user failed');
    });

    it('should handle createAnonymousUser.pending', () => {
        store.dispatch(createAnonymousUser.pending('', {} as AirtableUser));
        expect(store.getState().user.status).toBe('loading');
    });

    it('should handle createAnonymousUser.fulfilled', () => {
        const mockUser: AirtableUser = { id: 'anonymous123', fields: {} };
        store.dispatch(createAnonymousUser.fulfilled(mockUser, '', {} as AirtableUser));
        expect(store.getState().user.status).toBe('succeeded');
        expect(store.getState().user.currentUser).toEqual(mockUser);
    });

    it('should handle createAnonymousUser.rejected', () => {
        const mockError = new Error('Create anonymous user failed');
        store.dispatch(createAnonymousUser.rejected(mockError, '', {} as AirtableUser));
        expect(store.getState().user.status).toBe('failed');
        expect(store.getState().user.error).toBe('Create anonymous user failed');
    });

    it('should handle updateUser.pending', () => {
        store.dispatch(updateUser.pending('', {} as UserModel));
        expect(store.getState().user.status).toBe('loading');
    });

    it('should handle updateUser.fulfilled', () => {
        const mockUser: AirtableUser = { id: '123', fields: {} };
        store.dispatch(updateUser.fulfilled(mockUser, '', {} as UserModel));
        expect(store.getState().user.status).toBe('succeeded');
        expect(store.getState().user.currentUser).toEqual(mockUser);
    });

    it('should handle updateUser.rejected', () => {
        const mockError = new Error('Update user failed');
        store.dispatch(updateUser.rejected(mockError, '', {} as UserModel));
        expect(store.getState().user.status).toBe('failed');
        expect(store.getState().user.error).toBe('Update user failed');
    });

    it('should handle getByuid.pending', () => {
        store.dispatch(getByuid.pending('', 'uid123'));
        expect(store.getState().user.status).toBe('loading');
    });

    it('should handle getByuid.fulfilled', () => {
        const mockUser: AirtableUser = { id: '123', fields: {} };
        store.dispatch(getByuid.fulfilled(mockUser, '', 'uid123'));
        expect(store.getState().user.status).toBe('succeeded');
        expect(store.getState().user.currentUser).toEqual(mockUser);
    });

    it('should handle getByuid.rejected', () => {
        const mockError = new Error('Get user by UID failed');
        store.dispatch(getByuid.rejected(mockError, '', 'uid123'));
        expect(store.getState().user.status).toBe('failed');
        expect(store.getState().user.error).toBe('Get user by UID failed');
    });
});



let store;

describe('userSlice Thunks', () => {
    beforeEach(() => {
      // Limpiar mocks antes de cada test
      vi.clearAllMocks();
      store = configureStore({
        reducer: {
          airtableUser: airtableUserSlice,
        },
      });
    });
  
    it('createAnonymousUser should handle fulfilled state', async () => {
      const mockUser = { id: 'anonymous123', fields: {} };
      vi.spyOn(userService, 'createAnonymousAirtableUser').mockResolvedValue({
        data: mockUser,
      });
  
      await store.dispatch(createAnonymousUser(mockUser));
  
      
    });
  
    it('createAnonymousUser should handle rejected state', async () => {
      const mockError = new Error('Create anonymous user failed');
      vi.spyOn(userService, 'createAnonymousAirtableUser').mockRejectedValue(mockError);
  
      await store.dispatch(createAnonymousUser({ id: 'anonymous123', fields: {} }));
  
      
    });
  
    it('updateUser should handle fulfilled state', async () => {
      const mockUser = { id: '123', fields: {} };
      const userModel = { uid: '123', email: 'test@example.com' };
      vi.spyOn(userService, 'updateUser').mockResolvedValue({
        data: mockUser,
      });
  
      await store.dispatch(updateUser(userModel));
  
      
    });
  
    it('updateUser should handle rejected state', async () => {
      const mockError = new Error('Update user failed');
      const userModel = { uid: '123', email: 'test@example.com' };
      vi.spyOn(userService, 'updateUser').mockRejectedValue(mockError);
  
      await store.dispatch(updateUser(userModel));
  
      
    });
  
    it('getByuid should handle fulfilled state', async () => {
      const mockUser = { id: '123', fields: {} };
      vi.spyOn(userService, 'getUserByUid').mockResolvedValue({
        data: mockUser,
      });
  
      await store.dispatch(getByuid('123'));
  
      
    });
  
    it('getByuid should handle rejected state', async () => {
      const mockError = new Error('Get user by UID failed');
      vi.spyOn(userService, 'getUserByUid').mockRejectedValue(mockError);
  
      await store.dispatch(getByuid('123'));
  
      
    });
  });