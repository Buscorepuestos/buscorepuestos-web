// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../lib/firebase';
import { UserInfo } from 'firebase/auth';

interface FirebaseUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    phoneNumber: string | null;
    providerId: string;
    refreshToken: string;
    providerData: UserInfo[];
    tenantId: string | null;
}

interface FirebaseUserState {
    currentUser: FirebaseUser | null;
    isLoading: boolean;
}

const initialState: FirebaseUserState = {
    currentUser: null,
    isLoading: true,
};

const firebaseUserSlice = createSlice({
    name: 'firebaseUser',
    initialState,
    reducers: {
        setCurrentFirebaseUser(state, action: PayloadAction<FirebaseUser | null>) {
            state.currentUser = action.payload;
            state.isLoading = false;
        },
        clearFirebaseUser(state) {
            state.currentUser = null;
            state.isLoading = false;
        },
    },
});

export const { setCurrentFirebaseUser, clearFirebaseUser } = firebaseUserSlice.actions;
export default firebaseUserSlice.reducer;
