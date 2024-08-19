// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AirtableUser, UserModel } from '../../types/airtableUser';
import { userService } from '../../services/user/userService';

interface UserState {
    currentUser: AirtableUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    status: 'idle',
    error: null,
};

export const createUser = createAsyncThunk(
    'user/createUser',
    async (user: UserModel) => {
        const response = await userService.createUser(user);
        return response.data as unknown as AirtableUser;
    }
);

export const createAnonymousUser = createAsyncThunk(
    'user/createAnonymousUser',
    async (user: AirtableUser) => {
        const response = await userService.createAnonymousAirtableUser(user);
        return response.data as unknown as AirtableUser;
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (user: UserModel) => {
        const response = await userService.updateUser(user);
        return response.data as unknown as AirtableUser;
    }
);

export const getByuid = createAsyncThunk(
    'user/getByuid',
    async (uid: string) => {
        const response = await userService.getUserByUid(uid);
        return response.data as unknown as AirtableUser;
    }
);

const userSlice = createSlice({
    name: 'userAirtable',
    initialState,
    reducers: {
        setCurrentAirtableUser(state, action) {
            state.currentUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getByuid.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getByuid.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(getByuid.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createAnonymousUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createAnonymousUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(createAnonymousUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { setCurrentAirtableUser } = userSlice.actions;

export default userSlice.reducer;
